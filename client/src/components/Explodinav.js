/**
 * Created by gregrubino on 6/3/17.
 */
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Menu, {MenuItem} from 'material-ui/Menu';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';

const ProfileMenu = (user, anchorEl, isOpen, handleClose, callbacks) => {
  return (
    <Menu id="profile-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onRequestClose={handleClose}>
      <MenuItem onClick={callbacks.profile}>Profile</MenuItem>
      <MenuItem onClick={callbacks.logout}>Logout</MenuItem>
    </Menu>
  );
};

const LoginMenu = (anchorEl, isOpen, handleClose, callbacks) => {
  return (
    <Menu id="profile-menu"
          anchorEl={anchorEl}
          open={isOpen}
          onRequestClose={handleClose}>
      <MenuItem onClick={callbacks.about}>About</MenuItem>
      <MenuItem onClick={callbacks.login}>Login</MenuItem>
      <MenuItem onClick={callbacks.register}>Register</MenuItem>
    </Menu>
  );
};


export default class Explodinav extends React.Component {
  state = {
    openDrawer: false,
    profileMenuAnchor: null,
    profileMenuOpen: false
  };
  profileMenuCallbacks = {
    about: () => {
      this.handleNavCallback(this.props.aboutCallback);
      this.handleProfileMenuClose();
    },
    logout: () => {
      this.handleNavCallback(this.props.logoutCallback);
      this.handleProfileMenuClose();
    }
  };
  loginMenuCallbacks = {
    about: () => {
      this.handleNavCallback(this.props.aboutCallback);
      this.handleProfileMenuClose();
    },
    login: () => {
      this.handleNavCallback(this.props.loginCallback);
      this.handleProfileMenuClose();
    },
    register: () => {
      this.handleNavCallback(this.props.registerCallback);
      this.handleProfileMenuClose();
    }
  };
  constructor(props) {
    super(props);
  }

  handleNavCallback = (fn) => {
    fn();
  };

  handleProfileMenuClick = (event) => this.setState({profileMenuAnchor: event.currentTarget, profileMenuOpen: true});
  handleProfileMenuClose = () => this.setState({profileMenuOpen: false});

  _loggedInAvatarMenu(avatar) {
    return (
      <div>
        <IconButton onClick={this.handleProfileMenuClick}
                    aria-owns={this.state.profileMenuOpen ? 'profile-menu' : null}
                    aria-haspopup="true">
          {avatar}
        </IconButton>
        {ProfileMenu(this.state.user,
          this.state.profileMenuAnchor,
          this.state.profileMenuOpen,
          this.handleProfileMenuClose, this.profileMenuCallbacks)}
      </div>);
  }
  avatarMenu() {
    if (this.props.user) {
      const avatar = this.props.user.avatar ?
        <Avatar src={this.props.user.avatar} alt={this.props.user.email}/> : <Avatar>{this.props.user.email[0]}</Avatar>;
      return this._loggedInAvatarMenu(avatar);
    } else {
      return (
        <div>
          <IconButton onClick={this.handleProfileMenuClick}
                      aria-owns={this.state.profileMenuOpen ? 'profile-menu' : null}
                      aria-haspopup="true">
            <Avatar>?</Avatar>
          </IconButton>
          {LoginMenu(this.state.profileMenuAnchor,
            this.state.profileMenuOpen,
            this.handleProfileMenuClose, this.loginMenuCallbacks)}
        </div>);
    }
  }

  render() {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Typography type="title">
              EXPLODINATOR!
            </Typography>
            <Grid container alignItems="center" direction="row" justify="flex-end">
              {this.avatarMenu()}
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

