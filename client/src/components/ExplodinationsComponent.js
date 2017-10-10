'use strict';

import React from 'react';
import Gallery from 'react-photo-gallery';
import { PropTypes } from 'prop-types';

require('styles/Explodinations.css');

class ExplodinationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explodinations: []
    };
    this.explodinateIndicator = (
      <img src={`${this.props.s3UrlBase}/explodinate.gif`}/>
    );
  }

  _handleError() {
  }

  componentDidMount() {
    let apiUrlBase = this.props.apiUrlBase;
    let s3UrlBase = this.props.s3UrlBase;

    fetch(`${apiUrlBase}/explodinations`)
      .then(res => res.json())
      .then(resJson => {
        resJson.forEach(item => {
          let image = new Image();
          image.onload = () => {
            let newImages = this.state.explodinations.slice();
            newImages.push({
              src: `${s3UrlBase}/${item.key}`,
              width: image.width,
              height: image.height
            });
            this.setState({
              explodinations: newImages
            });
          };
          image.src = `${s3UrlBase}/${item.key}`;
        });
      }).catch(this._handleError);
  }

  render() {
    let explodinations = this.state.explodinations;
    if (explodinations.length > 0) {
      return (
        <Gallery photos={this.state.explodinations}/>
      );
    } else {
      return (<div>{this.explodinateIndicator}</div>);
    }
  }
}

ExplodinationsComponent.displayName = 'ExplodinationsComponent';

// Uncomment properties you need
ExplodinationsComponent.propTypes = {
  apiUrlBase: PropTypes.string,
  s3UrlBase: PropTypes.string
};
// ExplodinationsComponent.defaultProps = {};

export default ExplodinationsComponent;
