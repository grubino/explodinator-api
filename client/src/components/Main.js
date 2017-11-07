import React from 'react';
import ExplodinateComponent from './ExplodinateComponent';
import Explodinav from './Explodinav';
import ExplodinationsComponent from './ExplodinationsComponent';
import NotificationSystem from 'react-notification-system';
import Environment from './Environment';
import Dialog, {DialogContent, DialogActions, DialogTitle} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import {FormControl} from 'material-ui/Form';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {deepOrange, yellow, red} from 'material-ui/colors';
import Snackbar from 'material-ui/Snackbar';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import 'styles/App.css';

const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: yellow,
    error: red,
    type: 'dark'
  },
  typography: {
    fontSize: 14,
    title: {
      fontSize: 20
    },
    subheading: {
      fontSize: 14
    },
    button: {
      fontSize: 12
    }
  }
});

const Notification = (message, vertical, horizontal, open, handleClose) => {
  return (<Snackbar
    autoHideDuration={3000}
    anchorOrigin={{vertical, horizontal}}
    open={open}
    onRequestClose={handleClose}
    SnackbarContentProps={{
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{message}</span>} />);
};

const AboutDialog = (show, closeModals) => {
  return (<Dialog open={show} onRequestClose={closeModals}>
    <DialogTitle>
      What is Explodinator?
    </DialogTitle>
    <DialogContent>
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
    </DialogContent>
  </Dialog>);
};

const LoginDialog = (show, closeModals, handleChange, loginAction, showPassword, toggleShowPassword) => {
  return (<Dialog open={show}
                  onRequestClose={closeModals}>
    <DialogTitle>Log In</DialogTitle>
    <DialogContent>
      <TextField
        id="email"
        label="Email"
        onChange={handleChange('email')}
        fullWidth={true}/>
      <FormControl fullWidth={true}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="pass"
               type={showPassword ? 'text' : 'password'}
               onChange={handleChange('password')}
               endAdornment={<InputAdornment position="end">
                 <IconButton
                   onClick={toggleShowPassword}
                   onMouseDown={(event) => event.preventDefault()}>
                   {showPassword ? <VisibilityOff /> : <Visibility />}
                 </IconButton>
               </InputAdornment>}/>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button raised onClick={loginAction}>GO</Button>
    </DialogActions>
  </Dialog>);
};

const RegisterDialog = (show, closeModals, handleChange, registerAction, showPassword, toggleShowPassword) => {
  return (<Dialog open={show}
                  onRequestClose={closeModals}>
    <DialogTitle>Explodination Registration</DialogTitle>
    <DialogContent>
      <TextField
        id="email"
        label="Email"
        onChange={handleChange('email')}
        fullWidth={true}/>
      <FormControl fullWidth={true}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="pass"
               type={showPassword ? 'text' : 'password'}
               onChange={handleChange('password')}
               endAdornment={<InputAdornment position="end">
                 <IconButton
                   onClick={toggleShowPassword}
                   onMouseDown={(event) => event.preventDefault()}>
                   {showPassword ? <VisibilityOff /> : <Visibility />}
                 </IconButton>
               </InputAdornment>}/>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button raised onClick={registerAction}>Register</Button>
    </DialogActions>
  </Dialog>);
};

const Explodinate = (isLoggedIn) => {
  if (isLoggedIn) {
    return (<ExplodinateComponent/>);
  } else {
    return (<div/>);
  }
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.apiUrlBase = Environment.BASE_URL;

    this.state = {
      showModal: false,
      explodinations: [],
      user: null,
      loggingIn: false,
      loginInfo: {email: '', password: ''},
      notification: '',
      notificationOpen: false,
      showPassword: false,
      registering: false
    };
    this.reloadInterval = setInterval(() => this._loadinate(), 3000);
  }

  componentDidMount() {
    this._getMyUser();
  }

  _getMyUser = () => {
    fetch(`${this.apiUrlBase}/me`, {
      credentials: 'include'
    }).then(res => res.json())
      .then(resJson => this.setState({user: resJson}))
      .catch(err => this._handleError(err));
  };

  _handleError = (err) => {
    this.setState({notification: `${err}`, notificationOpen: true});
  };

  _loadinate() {

    fetch(`${this.apiUrlBase}/explodinations`, {
      credentials: 'include'
    }).then(res => res.json())
      .then(resJson => {
        let dirty = false;
        let newImages = this.state.explodinations.slice();
        resJson.forEach(item => {
          if (!newImages.find((im) => im.key === item._id.$oid)) {
            newImages.push({
              src: `${this.apiUrlBase}/explodinations/${item._id.$oid}`,
              key: item._id.$oid,
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

  _handleLoginDialogOpen = () => this.setState({loggingIn: true});
  _handleAbout = () => this.setState({showModal: true});
  _closeModals = () => this.setState({showModal: false, loggingIn: false, registering: false});
  _clearNotifications = () => this.setState({notificationOpen: false});
  _toggleShowPassword = () => this.setState({showPassword: !this.state.showPassword});
  _handleLoginInfoChange = name => event => {
    const loginInfo = this.state.loginInfo;
    loginInfo[name] = event.target.value;
    this.setState({
      loginInfo: loginInfo
    });
  };
  _handleLogin = () => {
    const loginInfo = this.state.loginInfo;
    fetch(`${this.apiUrlBase}/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(loginInfo),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status != 200) {
        this._handleError('Login Failed');
      }
      this._getMyUser();
      this._closeModals();
    }).catch(err => {
      this._handleError(err);
    });
  };
  _handleRegister = () => {
    const loginInfo = this.state.loginInfo;
    fetch(`${Environment.BASE_URL}/register?redirect=${window.location.href}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(loginInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status != 204) {
        this._handleError('Registration Failed');
      }
      this._closeModals();
    }).catch(err => {
      this._handleError(err);
    });
  };
  _handleLogout = () => {
    fetch(`${Environment.BASE_URL}/logout`, {
      credentials: 'include'
    }).then(() => {
      this.setState({user: null});
      this._closeModals();
    }).catch(err => {
      this._handleError(err);
    });
  };
  _handleRegisterDialogOpen = () => this.setState({registering: true});

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          {Notification(this.state.notification, 'bottom', 'center', this.state.notificationOpen, this._clearNotifications)}
          <Explodinav user={this.state.user}
                      aboutCallback={this._handleAbout}
                      loginCallback={this._handleLoginDialogOpen}
                      registerCallback={this._handleRegisterDialogOpen}
                      logoutCallback={this._handleLogout}/>
          {AboutDialog(this.state.showModal, this._closeModals)}
          {LoginDialog(this.state.loggingIn,
            this._closeModals,
            this._handleLoginInfoChange,
            this._handleLogin,
            this.state.showPassword,
            this._toggleShowPassword)}
          {RegisterDialog(this.state.registering,
            this._closeModals,
            this._handleLoginInfoChange,
            this._handleRegister,
            this.state.showPassword,
            this._toggleShowPassword)}
          {Explodinate(this.state.user !== null)}
          <ExplodinationsComponent explodinations={this.state.explodinations}
                                   s3UrlBase={Environment.S3_BASE}/>
          <NotificationSystem ref="notificationSystem" allowHTML={false}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
