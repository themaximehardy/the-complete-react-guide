import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuilder-458ca.firebaseio.com/',
});

export default instance;
