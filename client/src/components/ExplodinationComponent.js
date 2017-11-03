import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card, {CardMedia, CardActions, CardHeader} from 'material-ui/Card';
import Button from 'material-ui/Button';
import {ThumbUp, Share} from 'material-ui-icons';
import Avatar from 'material-ui/Avatar';


const imgWithClick = { cursor: 'pointer' };
const actionStyle = {
  backgroundColor: '#000'
};


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
      <Card>
        <CardHeader>
          <Avatar />
        </CardHeader>
        <CardMedia src={photo.src}>
          <video style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
                 {...photo}
                 onClick={onClick ? this.handleClick : null}
                 autoPlay loop controls/>
        </CardMedia>
        <CardActions style={actionStyle}>
          <Button fab color="primary"><ThumbUp/></Button>
          <p style={{color: '#888'}}>0</p>
          <Button fab color="primary"><Share/></Button>
          <p style={{color: '#888'}}>0</p>
        </CardActions>
      </Card>
    );
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired | PropTypes.string.isRequired,
  height: PropTypes.number.isRequired | PropTypes.string.isRequired,
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
