// maps through posts and renders Post
// connect
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Post from '../Post/Post_index';
import InfiniteScroll from 'react-infinite-scroller';
import discoverRefreshThunk from '../../thunks/discover_thunks/discoverRefreshThunk';
import newLikeThunk from '../../thunks/post_thunks/newLikeThunk';
import nextTenThunk from '../../thunks/discover_thunks/nextTenThunk';
import NewPostContainer from './Feed_NewPost_Container.js';
import './Feed.css';
import $ from 'jquery';
import { Loader, Segment } from 'semantic-ui-react';


let refresh;
let scrollPos;
let shouldRefire = true;

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilterPref: false,
      filters: [],
      count: 0,
      // modalIsOpen: false
    };
  }

  componentDidMount() {
    scrollPos = setInterval(() => { window.addEventListener('scroll', this.handleScroll()); }, 1000);
  }

  componentWillUnmount() {
    clearInterval(refresh);
    clearInterval(scrollPos);
  }

  handleScroll() {
    const winHeight = $(window).height();
    const docHeight = $(document).height();
    const value = $(window).scrollTop();
    const max = docHeight - winHeight;
    const percent = (value / max) * 100;
    if(percent > 22) {
      shouldRefire = true;
      clearInterval(refresh);
    } else {
      if(shouldRefire) {
        shouldRefire = false;
        refresh = setInterval(() => {
          if (!this.props.editing) {
            this.props.getRefresh(this.props.lastRefresh, this.props.useFilters);
          }
        }, 30000);
      }
    }
  }

  toggleFilterPref() {
    this.setState({showFilterPref: !this.state.showFilterPref});
  }

  _loadMore() {
    if (this.props.lastRefresh) {
      this.props.getNext10(this.props.data.posts.length, this.props.lastRefresh, this.props.useFilters);
    }
  }

  newConversationModal() {
    this.props.toggleModal();
    // this.setState({modalIsOpen: !this.state.modalIsOpen});
  }

  render() {
    if (this.props.data.isFetching || !this.props.isReady) {
      return (
        <div className="Feed_Wrapper">
          {[...Array(10)].map(() =>
            <Segment className="emptyLoaders">
              <Loader className="postLoader" active inline="centered" />
            </Segment>)}
        </div>
      );
    }
    return (
        <div className="Feed_Wrapper" id="FeedWrapper">
          <InfiniteScroll
              className="banterScroller"
              id="banterScroller"
              pageStart={0}
              loadMore={() => this._loadMore()}
              hasMore={this.props.hasMore}
              threshold={250}
              loader={<Loader active inline="centered" />}
              useWindow
          >
              {this.props.data.posts.map((post) => (
                  <Post ref="card"
                        key={post.postId}
                        isOpen={false}
                        currentUser={this.props.user}
                        postData={post}
                        newLike={() => (this.props.newLike(post.postId))}/>
              ))}
          </InfiniteScroll>
        </div>
    );
  }
}

// style={{height: '92vh', overflow: 'auto'}}

Feed.propTypes = {
  data: PropTypes.object,
  newLike: PropTypes.func,
  getRefresh: PropTypes.func,
  getNext10: PropTypes.func,
  hasMore: PropTypes.bool,
  user: PropTypes.object,
  isReady: PropTypes.bool,
  lastRefresh: PropTypes.string,
  useFilters: PropTypes.array,
  modalIsOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  editing: PropTypes.bool
};

const mapStateToProps = (state) => ({
  data: state.discoverReducer,
  hasMore: state.discoverReducer.hasMore,
  user: state.userReducer,
  isReady: state.discoverReducer.isReady,
  lastRefresh: state.discoverReducer.lastRefresh,
  useFilters: state.discoverReducer.useFilters,
  modalIsOpen: state.discoverReducer.modalIsOpen,
  editing: state.editPostReducer.editing
});

const mapDispatchToProps = (dispatch) => ({
  newLike: (id) => newLikeThunk(id)(dispatch),
  getRefresh: (lastRefresh, filters) => dispatch(discoverRefreshThunk(lastRefresh, filters)),
  getNext10: (param, lastRefresh, filters) => dispatch(nextTenThunk(param, lastRefresh, filters)),
  toggleModal: () => dispatch({type: 'MODAL_TOGGLE'})
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
