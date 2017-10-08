
import axios from 'axios';
import URL from '../../info';

const createCommunityThunk = (image, title, status, otherTags) => (dispatch) => {
  console.log('thunk', status, otherTags);
  axios.post(URL + 'db/create/community', {
    title: title,
    image: image,
    status: status,
    otherTags: otherTags
  })
    .then((response) => {
      dispatch({type: 'GET_USER_DATA_DONE', user: response.data.user});
      dispatch({ type: 'GET_ALL_COMMUNITIES_NEW', communities: response.data.communities});
    })
    .catch((err) => {
      console.log('probably failed to create community', err);
    });
};
export default createCommunityThunk;
