import React from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';
import {MdArrowBack, MdArrowForward, MdArrowDownward, MdArrowUpward} from 'react-icons/lib/md';

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
      trianglePositions: [],
      triangleRotations: []
    };

  }

  _onAnimate = () => {
    this._updateTriangles();
  };

  _generateTriangles() {

    function clamp(x, min, max) {
      return x < min ? min : (x > max ? max : x);
    }

    const ringRadius = 0.1, ringSize = 12,
      ringCount = 10, rings = new Array(ringCount),
      centerX = this.state.clickPosition[0],
      centerY = this.state.clickPosition[1];
    for (let i = 1; i < ringCount; i++) {
      rings[i] = { r: ringRadius * i, c: ringSize };
    }
    const vertices = [new THREE.Vector3(centerX, centerY, 0)].concat(rings.map(r => {
      const count = r.c, radius = r.r, variance = r.r * 0.05,
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
    const positions = triangles.map(() => new THREE.Vector3(0, 0, 0));
    const rotations = triangles.map(() => new THREE.Euler());
    this.setState({triangles: triangles, trianglePositions: positions, triangleRotations: rotations});
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
    const trianglePositions = this.state.trianglePositions;
    this.setState({trianglePositions: trianglePositions.map(t => new THREE.Vector3(
      t.x+0.05*(Math.random()-0.5),
      t.y+0.05*(Math.random()-0.5),
      t.z+0.05*(Math.random()-0.5)))});
  }

  _updateTriangleRotations() {
    const triangleRotations = this.state.triangleRotations;
    this.setState({triangleRotations: triangleRotations.map(t => new THREE.Euler(
      t.x+0.05*(Math.random()-0.5),
      t.y+0.05*(Math.random()-0.5),
      t.z+0.05*(Math.random()-0.5)))});
  }

  _updateTriangles() {
    this._updateTrianglePositions();
    this._updateTriangleRotations();
  }

  render() {
    return (
      <div ref={(node) => this._setWidth(node)}>
        <button onClick={this._moveUp.bind(this)}><MdArrowUpward /></button>
        <button onClick={this._moveLeft.bind(this)}><MdArrowBack /></button>
        <button onClick={this._moveRight.bind(this)}><MdArrowForward /></button>
        <button onClick={this._moveDown.bind(this)}><MdArrowDownward /></button>
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

