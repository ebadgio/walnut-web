// dispatches NewPost

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TagPrefContainer from './Feed_NewPost_TagPref_Container';
import NewTagContainer from './Feed_NewPost_NewTag_Container';
import newPostThunk from '../../thunks/post_thunks/newPostThunk';
import newTagThunk from '../../thunks/post_thunks/newTagThunk';
import discoverLoadThunk from '../../thunks/discover_thunks/discoverLoadThunk';
import ReactUploadFile from 'react-upload-file';
import { Icon, Button, Input } from 'semantic-ui-react';
import superagent from 'superagent';
import css from './Feed.css';

// TODO input that takes in content of post with # dropdown selector
// input is string # is array
// TODO post button dispatches newPost
// userPost is the string that gets updated in reducer


class NewPostContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postBody: '',
      postTags: [],
      newTags: [],
      tempTags: [],
      newFileName: null,
      file: ''
    };
  }

  addTags(tag) {
    const postTagsCopy = this.state.postTags.slice();
    if(postTagsCopy.includes(tag)) {
      const index = postTagsCopy.indexOf(tag);
      postTagsCopy.splice(index, 1);
      this.setState({postTags: postTagsCopy});
    } else {
      postTagsCopy.push(tag);
      this.setState({postTags: postTagsCopy});
    }
  }

  addNewTags(tag) {
    this.props.newTag(tag);
  }

  addTempTags(tags) {
    const whole = [].concat(tags);
    const tempTagsCopy = this.state.tempTags.slice();
    const postTagsCopy = this.state.postTags.slice();
    whole.forEach((tag) => {
      if(!tempTagsCopy.includes(tag)) {
        tempTagsCopy.push(tag);
        postTagsCopy.push(tag._id);
        this.setState({tempTags: tempTagsCopy, postTags: postTagsCopy});
      }
    });
  }

  removeTag(tag) {
    const newTagsCopy = this.state.newTags.slice();
    newTagsCopy.splice(newTagsCopy.indexOf(tag), 1);
    this.setState({newTags: newTagsCopy});
  }

  handleChange(e) {
    this.setState({postBody: e.target.value});
  }

  submitPost() {
    if (this.state.file !== '') {
      superagent.post('/aws/upload/post')
      .field('body', this.state.postBody ? this.state.postBody : '')
      .field('tags', this.state.postTags ? this.state.postTags : [])
      .field('name', this.state.newFileName ? this.state.newFileName : '')
      .attach('attach', this.state.file)
      .end((err, res) => {
        if (err) {
          console.log(err);
          alert('failed uploaded!');
        }
        this.props.discoverLoader();
        this.setState({postBody: '', postTags: [], showTagPref: false, file: '', tempTags: [], newTags: []});
      });
    } else {
      console.log('new post dispatching');
      this.props.newPost(this.state.postBody, this.state.postTags);
      this.setState({ postBody: '', postTags: [], showTagPref: false, file: '', tempTags: [], newTags: []});
    }
  }

  handleUpload(file) {
    this.setState({file: file});
  }

  changeFileName(name) {
    this.setState({newFileName: name});
  }

  render() {
    const optionsForUpload = {
      baseUrl: 'xxx',
      multiple: false,
      didChoose: (files) => {
        this.handleUpload(files[0]);
      },
    };

    return (
      <div className="newPost">
        <h3 id="newPostHeader">New Conversation</h3>
        <div className="row newPostContent">
          <Input id="textarea1"
            value={this.state.postBody}
            onChange={(e) => this.handleChange(e)} />
        </div>
        <div id="tagPrefTitleDiv"><h3 id="tagPrefTitleHash"># </h3><h4 id="tagPrefTitle"> add a topic</h4></div>
        <div className="row newPostTagsPref">
          <TagPrefContainer addTags={(tag) => (this.addTags(tag))}
                            tags={this.state.postTags}
                            addTempTags={(tag) => (this.addTempTags(tag))}
                            tempTags={this.state.tempTags}
                            newTags={this.state.newTags} />
          <NewTagContainer addToPost={(tag) => (this.addNewTags(tag))} />
        </div>
          <div className="row newPostFooter">
          <div className="fileUpload col-xs-6">
            <ReactUploadFile
              style={{width: '80px', height: '40px'}}
              chooseFileButton={<Icon className="attachFileIcon" name="attach" size="large" />}
              options={optionsForUpload}/>
              {(this.state.file !== '') ?
              <input value={(this.state.newFileName !== null) ? this.state.newFileName : this.state.file.name}
              onChange={(e) => this.changeFileName(e.target.value)}/>
                :
                null}
            </div>
            <div className="col-xs-6">
              <Button onClick={() => this.submitPost()} animated>
                <Button.Content visible>create</Button.Content>
                <Button.Content hidden>
                  <Icon name="send"/>
                </Button.Content>
              </Button>
            </div>
          </div>
      </div>
    );
  }
}

NewPostContainer.propTypes = {
  newPost: PropTypes.func,
  newTag: PropTypes.func,
  discoverLoader: PropTypes.func
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  newPost: (postBody, postTags) => dispatch(newPostThunk(postBody, postTags)),
  newTag: (tag) => dispatch(newTagThunk(tag)),
  discoverLoader: () => dispatch(discoverLoadThunk())
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPostContainer);
