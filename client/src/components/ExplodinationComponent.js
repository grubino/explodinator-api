import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const imgWithClick = { cursor: 'pointer' };

class ExplodinationComponent extends PureComponent {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { onClick, index, photo } = this.props;
    onClick(event, { photo, index });
  }

  render() {
    const { photo, onClick, margin } = this.props;
    const imgStyle = { display: 'block', float: 'left', margin: margin };
    return (
      <video
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        onClick={onClick ? this.handleClick : null}
        autoplay="true" loop controls
      />
    );
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  srcSet: PropTypes.array,
  sizes: PropTypes.array
});

ExplodinationComponent.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  photo: photoPropType
};

export default ExplodinationComponent;
