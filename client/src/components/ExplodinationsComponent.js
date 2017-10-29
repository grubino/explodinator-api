'use strict';

import React from 'react';
import Gallery from 'react-photo-gallery';
import Modal from 'react-bootstrap/lib/Modal';
import { PropTypes } from 'prop-types';
import ExplodinationComponent from 'components/ExplodinationComponent';

require('styles/Explodinations.css');

class ExplodinationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explodinations: [],
      selectedExplodination: null
    };
    this.explodinateIndicator = (
      <img width="100%" src={`${this.props.s3UrlBase}/explodinate.gif`}/>
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
          let newImages = this.state.explodinations.slice();
          newImages.push({
            src: `${s3UrlBase}/${item.key}`,
            key: item.key,
            width: 300,
            height: 300
          });
          this.setState({
            explodinations: newImages
          });
        });
      }).catch(this._handleError);
  }

  render() {
    let explodinations = this.state.explodinations;
    if (explodinations.length > 0) {
      return (
        <div>
        <Gallery photos={this.state.explodinations}
                 ImageComponent={ExplodinationComponent}
                 onClick={(event, info) => this.setState({selectedExplodination: this.state.explodinations[info.index]})}/>
          <Modal show={this.state.selectedExplodination !== null}
                 onHide={() => this.setState({selectedExplodination: null})}>
            <Modal.Header style={{backgroundColor: '#777'}} closeButton>
              <Modal.Title>
                { `Explodination: ${this.state.selectedExplodination && this.state.selectedExplodination.key}` }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#333'}}>
              <video width="100%"
                     src={this.state.selectedExplodination && `${this.props.s3UrlBase}/${this.state.selectedExplodination.key}`} controls/>
            </Modal.Body>
          </Modal>
        </div>
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
