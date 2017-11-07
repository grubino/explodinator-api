'use strict';

import React from 'react';
import { PropTypes } from 'prop-types';
import ExplodinationComponent from 'components/ExplodinationComponent';
import Grid from 'material-ui/Grid';

import 'styles/Explodinations.css';

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

  render() {
    let explodinations = this.props.explodinations;
    if (explodinations.length > 0) {
      return (
        <div style={{flexGrow: 1, marginTop: 70}}>
          <Grid container spacing={16}>
            {this.props.explodinations.map((explodination, i) =>
              <Grid key={i} item xs={12} md={6}>
                <ExplodinationComponent photo={explodination}/>
              </Grid>)}
          </Grid>
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
  s3UrlBase: PropTypes.string,
  explodinations: PropTypes.array
};
// ExplodinationsComponent.defaultProps = {};

export default ExplodinationsComponent;
