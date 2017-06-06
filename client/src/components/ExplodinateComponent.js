'use strict';

import React from 'react';
import DropzoneComponent from 'react-dropzone-component';
import Environment from './Environment';

require('styles/Explodinate.css');


class ExplodinateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.dz = null;
    this.componentConfig = {
      iconFiletypes: ['.jpg'],
      showFiletypeIcon: true,
      maxFiles: 1,
      postUrl: `/explodinate?key=${Environment.API_KEY}`,
      message: 'Drag a JPG here to EXPLODINATE!',
      paramName: () => 'frame0.jpg',
      renameFilename: () => 'frame0.jpg'
    };
    this.djsConfig = {
      addRemoveLinks: true
    };
    this.eventHandlers =  {
      init: (dropzone) => {
        this.dz = dropzone;
      }
    };
  }
  render() {
    return (
      <DropzoneComponent
        config={this.componentConfig}
        eventHandlers={this.eventHandlers}
        djsConfig={this.djsConfig} />
    );
  }
}

ExplodinateComponent.displayName = 'ExplodinateComponent';

// Uncomment properties you need
// ExplodinateComponent.propTypes = {};
// ExplodinateComponent.defaultProps = {};

export default ExplodinateComponent;
