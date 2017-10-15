'use strict';

import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import Modal from 'react-bootstrap/lib/Modal';
import ExplodinatorCube from './ExplodinatorCube';
import Environment from './Environment';

class ExplodinateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.dz = null;
    this.componentConfig = {
      iconFiletypes: ['.jpg'],
      showFiletypeIcon: true,
      maxFiles: 1,
      postUrl: `${Environment.BASE_URL}/uploadinate?key=${Environment.API_KEY}`,
      message: 'Drag a JPG here to EXPLODINATE!',
      uploadMultiple: false
    };
    this.djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg',
      autoProcessQueue: true
    };
    this.eventHandlers =  {
      init: (dropzone) => {
        this.dz = dropzone;
      }, success: (file, response) => {
        this.setState({
          showModal: true,
          imageUrl: `${Environment.BASE_URL}/uploadinations/${response['uploaded_key']}?key=${Environment.API_KEY}`
        });
      }
    };
    this.state = {
      showModal: false,
      response: null,
      imageUrl: null
    };
  }
  render() {
    return (
      <div>
        <button style={{'display': this.state.imageUrl === null ? 'none': 'inherit'}}
                onClick={() => this.setState({showModal: true})}>Explodinate Dialog</button>
        <DropzoneComponent
          config={this.componentConfig}
          eventHandlers={this.eventHandlers}
          djsConfig={this.djsConfig} />
        <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
          <Modal.Header style={{backgroundColor: '#777'}} closeButton>
            <Modal.Title>Explodinating</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor: '#333'}}>
            <ExplodinatorCube imageUrl={this.state.imageUrl}/>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

ExplodinateComponent.displayName = 'ExplodinateComponent';

// Uncomment properties you need
// ExplodinateComponent.propTypes = {};
// ExplodinateComponent.defaultProps = {};

export default ExplodinateComponent;
