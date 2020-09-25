import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

instance.defaults.headers.common['Authorization'] = 'AUTH_TOKEN_FROM_INSTANCE';

instance.interceptors.request.use(
  (request) => {
    console.log('request: ', request);
    // edit the request config before we return it
    return request; // we need to always return the request or the request config otherwise you're blocking the request.
  },
  (error) => {
    console.log('error: ', error);
    // handle the error globally (e.g. we want to log the error in the log file which we send to a server...)
    return Promise.reject(error);
  },
);

export default instance;
