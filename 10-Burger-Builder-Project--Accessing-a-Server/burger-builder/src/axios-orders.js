import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://url-abc123.firebaseio.com/',
});

export default instance;
