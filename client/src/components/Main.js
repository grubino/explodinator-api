
import React from 'react';
import ExplodinateComponent from './ExplodinateComponent';
import Explodinav from './Explodinav';
import ExplodinationsComponent from './ExplodinationsComponent';
import Modal from 'react-bootstrap/lib/Modal';
import NotificationSystem from 'react-notification-system';
import Environment from './Environment';

import 'styles/App.css';


class AboutComponent extends React.Component {
  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeCallback}>
        <Modal.Header style={{backgroundColor: '#777'}} closeButton>
          <Modal.Title>What is Explodinator?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#333'}}>
          <p>
            Explodinator is a content sharing platform that allows internet-goers to upload images
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
      showModal: false,
      explodinations: []
    };
    this.reloadInterval = setInterval(() => this._loadinate(), 3000)
  }

  _handleError() {}

  _loadinate() {

    let apiUrlBase = Environment.BASE_URL;
    let s3UrlBase = Environment.S3_BASE;

    fetch(`${apiUrlBase}/explodinations`)
      .then(res => res.json())
      .then(resJson => {
        let dirty = false;
        let newImages = this.state.explodinations.slice();
        resJson.forEach(item => {
          if (!newImages.find((im) => im.key === item.key)) {
            newImages.push({
              src: `${s3UrlBase}/${item.key}`,
              key: item.key,
              width: '100%',
              height: 'auto'
            });
            dirty = true;
          }
        });
        if (dirty) {
          this.setState({
            explodinations: newImages
          });
        }
      }).catch(this._handleError);

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
        <ExplodinationsComponent explodinations={this.state.explodinations}
                                 s3UrlBase={Environment.S3_BASE}/>
        <NotificationSystem ref="notificationSystem" allowHTML={false}/>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
