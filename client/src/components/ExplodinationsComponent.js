'use strict';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { PropTypes } from 'prop-types';

require('styles/Explodinations.css');
require('react-responsive-carousel/lib/styles/main.css');
require('react-responsive-carousel/lib/styles/carousel.css');

class ExplodinationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explodinations: []
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
        this.setState({
          explodinations: resJson.map(item => (<div><img src={`${s3UrlBase}/${item.key}`}/></div>))
        });
      }).catch(this._handleError);
  }
  render() {
    let explodinations = this.state.explodinations;
    if (explodinations.length > 0) {
      return (
        <Carousel axis='horizontal' showThumbs={false} showArrows={true}>
          {explodinations}
        </Carousel>
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
