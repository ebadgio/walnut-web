// renders in App
import React from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Dropdown, Button } from 'semantic-ui-react';
import './App.css';
import signOutThunk from '../../thunks/auth_thunks/signOutThunk';
import {history} from '../Auth/Auth_index';
import EditCommunityModal from './App_EditCommunityModal';
import updateCommunity from '../../thunks/community_thunks/updateCommunityThunk';
import axios from 'axios';
import URL from '../../info';


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isEdited,
      pos: 1,
      admin: false,
      innerWidth: window.innerWidth,
      openModal: false
    };
  }

  componentDidMount() {
    setInterval(() => {this.setState({innerWidth: window.innerWidth});}, 100);
  }

  handleClick(num) {
    this.setState({tab: num});
  }

  handleLogout() {
    this.props.onLogout(history);
  }

  handleLogoClick() {
    if (this.props.community.admins.filter((user) => (user._id === this.props.user)).length > 0) {
      this.setState({openModal: true });
    }
  }

  handleClose() {
    this.setState({openModal: false});
  }

  render() {
    let title;
    if (this.props.community) {
      title = this.props.community.title ? this.props.community.title.split(' ').join('') : 'bet';
    } else {
      title = 'missing';
    }
    return (
        <div className="row" id="navBar">
            <Link className="navBarHome" to={'/walnuthome'} onClick={() => {
              this.props.setHomeTrue();
              this.handleClick(1);
              this.setState({isOpen: true});
              this.props.clearDirectory();
              this.props.clearMinichats();
            }}>
                <img src="https://s3.amazonaws.com/walnut-logo/logo.svg" className="logo"/>
            </Link>
            <div className="communityNavBarLogo" onClick={() => this.handleLogoClick()}>
                <div className="imageWrapperCommunity">
                    <img className="communityImage" src={this.props.community.icon}/>
                </div>
                <span className="communityTitleNav">{this.props.community.title}</span>
            </div>

            <div className="navBarLinks">
                <Link className="profileLink" to={'/community/' + title + '/editprofile'}>
                  <div className="navUser">
                          <div className="imageWrapperNav">
                              <img className="postUserImage" src={this.props.pictureURL}/>
                          </div>
                          {this.props.fullName.split(' ')[0]}
                  </div>
                </Link>
              <Dropdown
                  className="menuDropdown"
                  icon="ellipsis vertical">
                  <Dropdown.Menu>
                      <Dropdown.Item className="dropdownLogout" onClick={() => this.handleLogout()}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>

            </div>

            <EditCommunityModal
            openModal={this.state.openModal}
            handleClose={() => this.handleClose()}
            community={this.props.community}/>
        </div>
    );
  }
}


Navbar.propTypes = {
  pictureURL: PropTypes.string,
  community: PropTypes.object,
  isEdited: PropTypes.bool,
  fullName: PropTypes.string,
  onLogout: PropTypes.func,
  history: PropTypes.object,
  user: PropTypes.string,
  updateCommunity: PropTypes.func,
  clearDirectory: PropTypes.func,
  setHomeTrue: PropTypes.func,
  clearMinichats: PropTypes.func
};

const mapStateToProps = (state) => ({
  pictureURL: state.userReducer.pictureURL,
  fullName: state.userReducer.fullName,
  user: state.userReducer._id,
  community: state.userReducer.currentCommunity,
  isEdited: state.userReducer.isEdited
});

const mapDispatchToProps = (dispatch) => ({
  onLogout: (his) => dispatch(signOutThunk(his)),
  updateCommunity: (img, title, oldT, newT, admins) => dispatch(updateCommunity(img, title, oldT, newT, admins)),
  clearDirectory: () => dispatch({type: 'DIRECTORY_FRESH'}),
  setHomeTrue: () => dispatch({ type: 'WALNUT_READY'}),
  clearMinichats: () => dispatch({type: 'CLEAR_CHATS'})
});


export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

