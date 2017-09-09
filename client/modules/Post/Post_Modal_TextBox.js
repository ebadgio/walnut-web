
import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Popup, Icon } from 'semantic-ui-react';
import firebaseApp from '../../firebase';
import $ from 'jquery';
import uuidv4 from 'uuid/v4';

class ModalTextBox extends React.Component {

  componentWillMount() {
    this.watchForTypers();
  }

  watchForTypers() {
    const user = firebaseApp.auth().currentUser;
    const typersRef = firebaseApp.database().ref('/typers' + '/' + this.props.postData.postId);
    typersRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const pairs = _.pairs(snapshot.val());
        const typers = pairs.filter((pair) => pair[1])
          .map((typer) => typer[1])
          .filter((obj) => obj.typerId !== user.uid);
        this.setState({ typers: typers });
      } else {
        this.setState({ typers: [] });
      }
    });
  }

  handleChange(e) {
    if (e.target.value) {
      this.setState({ commentBody: e.target.value });
    }
  }

  findEnter() {
    $('#messageInput').keypress((event) => {
      if (event.which === 13) {
        this.handleClick(this.props.postData.postId, null);
        return false; // prevent duplicate submission
      }
      return null;
    });
  }

  handleClick(id) {
    const updates = {};
    updates['/typers/' + this.props.postData.postId + '/' + this.state.user.uid] = null;
    firebaseApp.database().ref().update(updates);
    if (this.state.commentBody.length > 0) {
      const commentBody = this.state.commentBody;
      const split = commentBody.split(' ');
      split.forEach((word, idx) => {
        if (word.length > 31) {
          const firstHalf = word.slice(0, 32);
          const secondHalf = word.slice(32);
          split[idx] = firstHalf + '\n' + secondHalf;
        }
      });
      const useBody = split.join(' ');
      const message = {
        author: this.state.user.displayName,
        authorId: this.state.user.uid,
        content: this.state.commentBody,
        createdAt: new Date(),
        authorPhoto: this.props.currentUser.pictureURL
      };
      // use follows, and subtract members (members is currently on)
      // notification stuff
      console.log('members array here', this.state.members);
      let temp = {};
      firebaseApp.database().ref('/followGroups/' + this.props.postData.postId).once('value', snapshot => {
        console.log('these people are following the post', snapshot.val());
        const followers = Object.keys(snapshot.val());
        const memberIds = this.state.members.map(member => member.uid);
        followers.forEach(follower => {
          let unreadCount = firebaseApp.database().ref('/unreads/' + member.uid + '/' + this.props.postData.postId);
          console.log('got in here?', memberIds, follower, snapshot.val()[follower]);
          if (snapshot.val()[follower] && !memberIds.includes(follower)) {
            firebaseApp.database().ref('/unreads/' + follower + '/' + this.props.postData.postId).once('value', snapshotB => {
              let unreadCount = snapshotB.val();
              console.log('unreadCount', snapshotB.val());
              temp['/unreads/' + follower + '/' + this.props.postData.postId] = !isNaN(unreadCount) ? unreadCount + 1 : 1;
              firebaseApp.database().ref().update(temp);
            });
          }
        });
      });
      // notification stuff ends here
      this.setState({ commentBody: '', prevBody: '' });
      const update = {};
      const newMessageKey = firebaseApp.database().ref().child('messages').push().key;
      update['/messages/' + id + '/' + newMessageKey] = message;
      firebaseApp.database().ref().update(update);
      const messagesCountRef = firebaseApp.database().ref('/counts/' + this.props.postData.postId + '/count');
      messagesCountRef.transaction((currentValue) => {
        return (currentValue || 0) + 1;
      });
    }
    const elem = document.getElementById('messageInput');
    elem.value = '';
  }

  addEmoji(emoj) {
    console.log('this is the emoji', emoj.native);
    this.setState({ emojiIsOpen: false });
    // this.handleClick(this.props.postData.postId, emoj.native);
  }

  openEmojiPicker() {
    this.setState({ emojiIsOpen: !this.state.emojiIsOpen });
  }

  render() {
    return (
      <div className="textBoxDiv">
        <div className="iconBar">
          <div className="typing">
            {this.state.typers.map((typer) =>
              <div key={uuidv4()} className="typerGroup">
                <Popup
                  trigger={<div className="imageWrapper messageAvatarOther typingImage">
                    <img className="postUserImage" src={typer.typerPhoto} />
                  </div>}
                  content={typer.typer}
                  position="left center"
                  inverted
                />
                <Icon className="typingIcon" name="ellipsis horizontal" size="big" />
              </div>
            )}
          </div>
          <div className="actions">
            <Icon onClick={() => this.openEmojiPicker()} size="big" name="smile" className="emojiPicker" />
          </div>
        </div>
        <Form className="textBoxForm">
            <TextArea
                id="messageInput"
                autoHeight
                placeholder="Give your two cents..."
                onChange={(e) => { this.props.handleChange(e); this.props.findEnter();}}
                rows={3}
            />
        </Form>
      </div>
        );
  }
}

ModalTextBox.propTypes = {
  handleChange: PropTypes.func,
  findEnter: PropTypes.func,
  comment: PropTypes.string,
};

export default ModalTextBox;
