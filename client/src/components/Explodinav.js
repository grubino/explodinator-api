/**
 * Created by gregrubino on 6/3/17.
 */
import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';


export default class Explodinav extends React.Component {
  constructor(props) {
    super(props);
    this.aboutCb = props.aboutCallback;
  }

  render() {
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">EXPLODINATOR!</a>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={2} href="#">How It Works</NavItem>
              <NavItem eventKey={1} onClick={this.aboutCb} href="#">About</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

