import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://url-012345.firebaseio.com/',
});

export default instance;
