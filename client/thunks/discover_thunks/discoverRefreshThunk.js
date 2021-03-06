
import axios from 'axios';
import URL from '../../info';

const discoverRefreshThunk = (lastRefresh, filters) => (dispatch) => {
  console.log('inside refresh thunk');
  axios.get(URL + 'db/get/discoverrefresh?lastRefresh=' + lastRefresh + '&filters=' + filters)
    .then((response) => {
      if (response.data.posts.length > 0) {
        dispatch({
          type: 'GET_DISCOVER_DATA_REFRESH',
          posts: response.data.posts,
          lastRefresh: response.data.lastRefresh,
        });
        dispatch({
          type: 'GET_POST_NOTIFICATION',
          posts: response.data.posts
        });
      }
    })
    .catch((err) => {
      console.log('error in discoverRefreshThunk', err);
      dispatch({ type: 'GET_DISCOVER_DATA_ERROR' });
    });
};

export default discoverRefreshThunk;

