import React from 'react';
import * as THREE from 'three';
import React3 from 'react-three-renderer';


export default class ExplodinatorCube extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.cameraPosition = new THREE.Vector3(0, 0, 1);
    this.state = {
      cubeRotation: new THREE.Euler(),
      width: 0,
      height: 0
    };
  }

  calcWidth(node) {
    if (node && !this.state.width) {
      this.setState({
        width: node.offsetWidth,
        height: node.offsetWidth * 3 / 4
      });
    }
  }

  render() {
    return (
      <div ref={(node) => this.calcWidth(node)}>
        <React3 mainCamera="camera"
                width={this.state.width}
                height={this.state.height}
                onAnimate={this._onAnimate}>
          <scene>
            <perspectiveCamera name="camera"
                               fov={50}
                               aspect={this.state.width / this.state.height}
                               near={0.1}
                               far={1000}
                               position={this.cameraPosition}/>
            <mesh rotation={this.state.cubeRotation}>
              <planeGeometry width={1} height={1} depth={1}/>
              <meshBasicMaterial color={0xaaaaaa}>
                <texture url={this.props.imageUrl}
                         crossOrigin=''
                         minFilter={THREE.LinearFilter}/>
              </meshBasicMaterial>
            </mesh>

          </scene>
        </React3>
      </div>
    );
  }
}

