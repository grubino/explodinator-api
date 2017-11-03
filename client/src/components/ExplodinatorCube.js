import React from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';
import MediaStreamRecorder from 'msr';
import {PropTypes} from 'prop-types';

export default class ExplodinatorCube extends React.Component {
  constructor(props, context) {
    super(props, context);

    const posArray = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      posArray[i] = Math.random() - 0.5;
    }

    this.explosionStartTile = 6;
    this.canvas = null;
    this.mediaStream = null;
    this.mediaRecorder = null;

    this.state = {
      cubeRotation: new THREE.Euler(),
      width: 0,
      height: 0,
      triangles: [],
      clickPosition: [0, 0],
      cameraPosition: new THREE.Vector3(0, 0, 10),
      lookAt: new THREE.Vector3(0, 0, 0),
      triangleRotations: [],
      triangleInitialRotations: [],
      triangleRotationMagnitudes: [],
      triangleTrajectories: [],
      triangleMagnitudes: [],
      triangleVelocities: [],
      triangleAccelerations: [],
      triangleAccelerationDecay: 0.8,
      trianglePositions: [],
      explosionLocation: new THREE.Vector3(0, 0, 0),
      explosionRotation: new THREE.Euler(),
      isExploding: false,
      currentExplosionTile: this.explosionStartTile,
      currentExplosionOffset: this._getExplosionOffset(this.explosionStartTile),
      tileDisplayDuration: 0,
      blobUrl: null,
      blob: null
    };

    this.textureTiles = 36;
    this.tileHorizontal = 6;
    this.tileVertical = 6;
    this.explosionRepeat = new THREE.Vector2(1 / this.tileHorizontal, 1 / this.tileVertical);
    this.clock = new THREE.Clock();

  }

  _getExplosionOffset(currentExplosionTile) {
    const currentExplosionTileCol = currentExplosionTile % this.tileHorizontal,
      currentExplosionTileRow = Math.floor(currentExplosionTile / this.tileHorizontal);
    return new THREE.Vector2(
      currentExplosionTileCol / this.tileHorizontal,
      1.0 - currentExplosionTileRow / this.tileVertical);
  }

  _onExplodinateFinished() {
    this.setState({isExploding: false, tileDisplayDuration: 0});
    this.clock = new THREE.Clock();
    this.mediaRecorder.ondataavailable = (blob) => this.setState({blobUrl: URL.createObjectURL(blob), blob: blob.slice()});
    this.mediaRecorder.stop();
  }

  _updateTextures() {
    const tileDisplayDuration = this.state.tileDisplayDuration + this.clock.getDelta()*1000;
    if (tileDisplayDuration > 50) {
      if (this.state.currentExplosionTile < this.textureTiles + this.tileHorizontal - 1) {
        const currentExplosionTile = this.state.currentExplosionTile + 1;
        this.setState({
          currentExplosionTile: currentExplosionTile,
          tileDisplayDuration: 0,
          currentExplosionOffset: this._getExplosionOffset(currentExplosionTile)
        });
      } else {
        this._onExplodinateFinished();
      }
    } else {
      this.setState({tileDisplayDuration: tileDisplayDuration});
    }
  }

  _onAnimate = () => {
    if (this.state.isExploding) {
      if (this.state.currentExplosionTile > 10) {
        this._updateTriangles();
      }
      this._updateTextures();
    }
  };

  _generateTriangles() {

    function clamp(x, min, max) {
      return x < min ? min : (x > max ? max : x);
    }

    const ringRadius = 0.01, ringSize = 33,
      ringCount = 10, rings = new Array(ringCount),
      centerX = this.state.clickPosition[0],
      centerY = this.state.clickPosition[1];

    for (let i = 1; i < ringCount; i++) {
      rings[i] = { r: ringRadius * i, c: ringSize };
    }

    const vertices = [new THREE.Vector3(centerX, centerY, 0)].concat(rings.map((r, i) => {
      const count = r.c, radius = Math.pow(2, i) * r.r, variance = r.r * 0.01,
        ary = new Array(count).fill(0);
      return ary.map((zero, j) => {
        const x = clamp(
          radius * Math.cos((j / count) * 2 * Math.PI) + centerX + 2*(Math.random() - 0.5) * variance, -1, 1),
          y = clamp(radius * Math.sin((j / count) * 2 * Math.PI) + centerY + 2*(Math.random() - 0.5) * variance, -1, 1);
        return new THREE.Vector3(x, y, 0);
      });
    }).reduce((a, b) => a.concat(b), [])),
      triangles = THREE.ShapeUtils.triangulate(vertices),
      rotations = triangles.map(() => new THREE.Euler(Math.random(), Math.random(), Math.random())),
      rotationMagnitudes = triangles.map(() => 0),
      rotationVelocities = triangles.map(() => 0),
      trajectories = triangles.map(() => new THREE.Vector3(
        Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)),
      magnitudes = triangles.map(() => 0),
      velocities = triangles.map(() => 0),
      accelerations = triangles.map(() => 0);

    this.setState({
      triangles: triangles,
      triangleInitialRotations: rotations,
      triangleRotations: rotations.map((r, i) =>
        new THREE.Euler(
          r.x*rotationMagnitudes[i],
          r.y*rotationMagnitudes[i],
          r.z*rotationMagnitudes[i]
        )),
      triangleRotationVelocities: rotationVelocities,
      triangleRotationMagnitudes: rotationMagnitudes,
      triangleTrajectories: trajectories,
      triangleMagnitudes: magnitudes,
      triangleVelocities: velocities,
      triangleAccelerations: accelerations,
      trianglePositions: trajectories.map((t, i) => new THREE.Vector3(
        t.x*magnitudes[i], t.y*magnitudes[i], t.z*magnitudes[i]))
    });
  }

  _setWidth(node) {
    if (node && !this.state.width) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetWidth * 3 / 4
      });
      this._generateTriangles();
    }
  }

  _moveUp() {
    this.setState({lookAt: new THREE.Vector3(
      this.state.lookAt.x, this.state.lookAt.y+0.1, 0)});
  }
  _moveLeft() {
    this.setState({lookAt: new THREE.Vector3(
      this.state.lookAt.x-0.1, this.state.lookAt.y, 0)});
  }
  _moveRight() {
    this.setState({lookAt: new THREE.Vector3(
      this.state.lookAt.x+0.1, this.state.lookAt.y, 0)});
  }
  _moveDown() {
    this.setState({lookAt: new THREE.Vector3(
      this.state.lookAt.x, this.state.lookAt.y-0.1, 0)});
  }

  _updateTrianglePositions() {
    const triangleAccelerations = this.state.triangleAccelerations.map(a => a * this.state.triangleAccelerationDecay);
    const triangleVelocities = this.state.triangleVelocities.map((v, i) =>
      v + triangleAccelerations[i]);
    const triangleMagnitudes = this.state.triangleMagnitudes.map((m, i) =>
      m + triangleVelocities[i]);
    const trianglePositions = this.state.triangleTrajectories.map((t, i) => new THREE.Vector3(
      t.x*triangleMagnitudes[i], t.y*triangleMagnitudes[i], t.z*triangleMagnitudes[i]
    ));
    this.setState({
      trianglePositions: trianglePositions,
      triangleMagnitudes: triangleMagnitudes,
      triangleVelocities: triangleVelocities,
      triangleAccelerations: triangleAccelerations
    });
  }

  _updateTriangleRotations() {
    const triangleRotationMagnitudes = this.state.triangleRotationMagnitudes.map((m, i) =>
      m + this.state.triangleRotationVelocities[i]);
    const triangleRotations = this.state.triangleInitialRotations.map((r, i) =>
      new THREE.Euler(
        triangleRotationMagnitudes[i]*r.x,
        triangleRotationMagnitudes[i]*r.y,
        triangleRotationMagnitudes[i]*r.z));
    this.setState({triangleRotations: triangleRotations, triangleRotationMagnitudes: triangleRotationMagnitudes});
  }

  _updateTriangles() {
    this._updateTrianglePositions();
    this._updateTriangleRotations();
  }

  _explodinate() {
    const accelerations = this.state.triangles.map(() => 0.1);
    const rotationVelocities = this.state.triangles.map(() => 0.05 * Math.PI);
    this.mediaStream = this.canvas.captureStream();
    this.mediaRecorder = new MediaStreamRecorder(this.mediaStream);
    this.mediaRecorder.start();
    this.setState({
      triangleAccelerations: accelerations,
      triangleRotationVelocities: rotationVelocities,
      isExploding: true,
      currentExplosionTile: this.explosionStartTile,
      currentExplosionOffset: new THREE.Vector2(0, 0)
    });
  }

  _uploadinateExplodination() {
    const fd = new FormData();
    const file = new File([this.state.blob], 'explodination.webm', {
      type: 'video/webm'
    });
    fd.append('explodination', file);
    fetch(this.props.explodinationUrl, {
      method: 'POST', body: fd
    }).then(this.props.onUploadCallback).catch(err => alert(err));
  }

  render() {
    if (this.state.blobUrl === null) {
      return (
        <div ref={(node) => this._setWidth(node)}>
          <button onClick={this._explodinate.bind(this)}>Explodinate</button>
          <React3 mainCamera="camera"
                  canvasRef={(canvas) => this.canvas = canvas}
                  width={this.state.width}
                  height={this.state.height}
                  onAnimate={this._onAnimate}>
            <scene>
              <resources>
                {this.state.triangles.map((t, i) =>
                  (<shape key={`triangle-resource-${i}`}
                          resourceId={`triangle-resource-${i}`}>
                    <moveTo x={t[0].x} y={t[0].y}/>
                    <lineTo x={t[1].x} y={t[1].y}/>
                    <lineTo x={t[2].x} y={t[2].y}/>
                    <lineTo x={t[0].x} y={t[0].y}/>
                  </shape>))}
                <texture resourceId='explodinate-texture'
                         minFilter={THREE.LinearFilter}
                         offset={new THREE.Vector2(0.5, 0.5)}
                         crossOrigin=''
                         url={this.props.imageUrl}/>
                <texture resourceId='explosion-texture'
                         minFilter={THREE.LinearFilter}
                         offset={this.state.currentExplosionOffset}
                         crossOrigin=''
                         url={this.props.explosionUrl}
                         wrapS={THREE.RepeatWrapping} wrapT={THREE.RepeatWrapping}
                         repeat={this.explosionRepeat}/>
              </resources>
              <perspectiveCamera name="camera"
                                 fov={5}
                                 aspect={this.state.width / this.state.height}
                                 near={0.1}
                                 far={1000}
                                 lookAt={this.state.lookAt}
                                 position={this.state.cameraPosition}/>
              {this.state.triangles.map((t, i) =>
                (<mesh key={`triangle-${i}`}
                       position={this.state.trianglePositions[i]}
                       rotation={this.state.triangleRotations[i]}>
                  <shapeGeometryResource resourceId={`triangle-resource-${i}`}
                                         type="shape"/>
                  <meshBasicMaterial color={0xaaaaaa}>
                    <textureResource resourceId='explodinate-texture'/>
                  </meshBasicMaterial>
                </mesh>))}
              <mesh>
                <planeBufferGeometry width={2}
                                     height={2}
                                     widthSegments={4}
                                     heightSegments={4}/>
                <meshBasicMaterial color={0xaaaaaa}>
                  <textureResource resourceId='explosion-texture'/>
                </meshBasicMaterial>
              </mesh>
            </scene>
          </React3>
        </div>
      );
    } else {
      return (
        <div ref={(node) => this._setWidth(node)}>
          <button onClick={this._uploadinateExplodination.bind(this)}>Uploadinate Explodination</button>
          <video src={this.state.blobUrl} controls/>
        </div>
      );
    }
  }
}

// Uncomment properties you need
ExplodinatorCube.propTypes = {
  onUploadCallback: PropTypes.func,
  imageUrl: PropTypes.string,
  explodinationUrl: PropTypes.string,
  explosionUrl: PropTypes.string
};
// ExplodinateComponent.defaultProps = {};

