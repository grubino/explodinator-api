import React from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';

export default class ExplodinatorCube extends React.Component {
  constructor(props, context) {
    super(props, context);
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
      trianglePositions: []
    };

  }

  _onAnimate = () => {
    this._updateTriangles();
  };

  _generateTriangles() {

    function clamp(x, min, max) {
      return x < min ? min : (x > max ? max : x);
    }

    const ringRadius = 0.1, ringSize = 33,
      ringCount = 13, rings = new Array(ringCount),
      centerX = this.state.clickPosition[0],
      centerY = this.state.clickPosition[1];
    for (let i = 1; i < ringCount; i++) {
      rings[i] = { r: ringRadius * i, c: ringSize };
    }
    const vertices = [new THREE.Vector3(centerX, centerY, 0)].concat(rings.map(r => {
      const count = r.c, radius = r.r, variance = r.r * 0.01,
        ary = new Array(count).fill(0);
      return ary.map((zero, j) => {
        const x = clamp(
          radius * Math.cos((j / count) * 2 * Math.PI) + centerX + 2*(Math.random() - 0.5) * variance,
          -1, 1);
        const y = clamp(
          radius * Math.sin((j / count) * 2 * Math.PI) + centerY + 2*(Math.random() - 0.5) * variance,
          -1, 1);
        return new THREE.Vector3(x, y, 0);
      });
    }).reduce((a, b) => a.concat(b), []));
    const triangles = THREE.ShapeUtils.triangulate(vertices);
    const rotations = triangles.map(() => new THREE.Euler(Math.random(), Math.random(), Math.random()));
    const rotationMagnitudes = triangles.map(() => 0);
    const rotationVelocities = triangles.map(() => 0);
    const trajectories = triangles.map(() => new THREE.Vector3(
      Math.random()-0.5, Math.random()-0.5, Math.random()-0.5));
    const magnitudes = triangles.map(() => 0);
    const velocities = triangles.map(() => 0);
    const accelerations = triangles.map(() => 0);
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
    const accelerations = this.state.triangles.map(() => 0.09);
    const rotationVelocities = this.state.triangles.map(() => 0.04 * Math.PI);
    this.setState({
      triangleAccelerations: accelerations,
      triangleRotationVelocities: rotationVelocities
    });
  }

  _reimplodinate() {
    const accelerations = this.state.triangles.map(() => 0);
    const velocities = this.state.triangles.map(() => 0);
    const magnitudes = this.state.triangles.map(() => 0);
    const positions = this.state.triangleTrajectories.map((t, i) => new THREE.Vector3(
      t.x*magnitudes[i], t.y*magnitudes[i], t.z*magnitudes[i])
    );
    const rotationVelocities = this.state.triangles.map(() => 0);
    const rotationMagnitudes = this.state.triangles.map(() => 0);
    this.setState({
      triangleAccelerations: accelerations,
      triangleVelocities: velocities,
      triangleMagnitudes: magnitudes,
      trianglePositions: positions,
      triangleRotationMagnitudes: rotationMagnitudes,
      triangleRotationVelocities: rotationVelocities
    });
  }

  render() {
    return (
      <div ref={(node) => this._setWidth(node)}>
        <button onClick={this._explodinate.bind(this)}>Explodinate</button>
        <button onClick={this._reimplodinate.bind(this)}>Reimplodinate</button>
        <React3 mainCamera="camera"
                width={this.state.width}
                height={this.state.height}
                onAnimate={this._onAnimate}>
          <scene>
            <resources>
              { this.state.triangles.map((t, i) =>
                (<shape key={`triangle-resource-${i}`}
                        resourceId={`triangle-resource-${i}`}>
                  <moveTo x={t[0].x} y={t[0].y}/>
                  <lineTo x={t[1].x} y={t[1].y}/>
                  <lineTo x={t[2].x} y={t[2].y}/>
                  <lineTo x={t[0].x} y={t[0].y}/>
                </shape>)) }
              <texture resourceId='explodinate-texture'
                       minFilter={THREE.LinearFilter}
                       offset={new THREE.Vector2(0.5, 0.5)}
                       crossOrigin=''
                       url={this.props.imageUrl} />
            </resources>
            <perspectiveCamera name="camera"
                               fov={5}
                               aspect={this.state.width / this.state.height}
                               near={0.1}
                               far={1000}
                               lookAt={this.state.lookAt}
                               position={this.state.cameraPosition}/>
              { this.state.triangles.map((t, i) =>
                (<mesh key={`triangle-${i}`}
                       position={this.state.trianglePositions[i]}
                       rotation={this.state.triangleRotations[i]}>
                  <shapeGeometryResource resourceId={`triangle-resource-${i}`}
                                         type="shape"/>
                  <meshBasicMaterial color={0xaaaaaa}>
                    <textureResource resourceId='explodinate-texture'/>
                  </meshBasicMaterial>
                </mesh>)) }
          </scene>
        </React3>
      </div>
    );
  }
}

