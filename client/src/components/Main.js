
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ExplodinateComponent from './ExplodinateComponent';
import Explodinav from './Explodinav';
import ExplodinationsComponent from './ExplodinationsComponent';
import Environment from './Environment';
import Modal from 'react-bootstrap/lib/Modal';
import NotificationSystem from 'react-notification-system';


class AboutComponent extends React.Component {
  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeCallback}>
        <Modal.Header style={{backgroundColor: '#777'}} closeButton>
          <Modal.Title>What is Explodinator?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#333'}}>
          <p>
            Explodinator is a content sharing platform that allows internet-goers to upload JPG images
            and create animations of them exploding.
          </p>
          <img width="100%" src={`${Environment.S3_BASE}/explodinate.gif`}/>
          <h4>Coming Soon From Explodinator Labs...</h4>
          <ul>
            <li>More Explodination Styles!</li>
            <li>Social Networking Content Promotion!</li>
          </ul>
        </Modal.Body>
      </Modal>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  render() {
    return (
      <div>
        <Explodinav
          aboutCallback={this.setState.bind(this, {showModal: true})}/>
        <AboutComponent
          showModal={this.state.showModal}
          closeCallback={this.setState.bind(this, {showModal: false})}/>
        <ExplodinateComponent/>
        <ExplodinationsComponent
          apiUrlBase={Environment.BASE_URL}
          s3UrlBase={Environment.S3_BASE}/>
        <NotificationSystem ref="notificationSystem" allowHTML={false}/>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
