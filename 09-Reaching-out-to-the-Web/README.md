# Reaching out to the Web (Http / Ajax)

_Useful Resources & Links_

- [Axios Docs](https://github.com/axios/axios)

### 1. Introduction

Let's see how we can send HTTP requests form our React app to a server.

### 2. Understanding HTTP Requests in React

The React app and the server need to communicate from time to time but they don't communicate by exchanging HTML pages. Instead some JSON data will be exchange/send FE <-> BE.

### 3. Understanding our Project and Introducing Axios

**Download the initial project** and then go to [JSONPlaceholder](https://jsonplaceholder.typicode.com/). This is a back-end, a RESTful API back-end where we can send requests to **fetch some dummy data** or to simulate **"storing" some dummy data** there, though we won't actually store anything on their servera of course, it's just faking some data.

In the next lecture we're going to start sending ajax requests. We have 2 options:

1. Using the XML HTTP request Object (from JavaScript) – `XMLHttpRequest`. Then, we can construct our own Ajax requests and send them to a specific URL and handle the response. But writing and configuring requests with that object manually is quite cumbersome.
2. Using a package, a third-party library which makes that easier, we're going to use **[Axios](https://www.npmjs.com/package/axios)** here!

```sh
yarn add axios
```

### 4. Creating an HTTP Request to GET Data

We could start by fetching some [posts](https://jsonplaceholder.typicode.com/posts) and load them into our `Blog` component (in `src/containers/Blog/Blog.js`). **But where do we make this HTTP request then?**

There is one life cycle hook we should use for side effects, `componentDidMount` and the HTTP request is a side effect, it doesn't affect our React logic but it has the side effect of fetching new data. If our React application is dynamically outputting some dat, the data changing of course is a side effect affecting our application. So `componentDidMount` **is a great place for causing side effects but not for updating state since it triggers a re-render**.

_Note: `useEffect()` is the place to fetching new data when we use a functional component!_

Using Axios is async, it uses promises and GET returns a promise.

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import axios from 'axios';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      console.log('resp: ', response);
    });
  }

  render() {
    return (
      <div>
        <section className="Posts">
          <Post />
          <Post />
          <Post />
        </section>
        <section>
          <FullPost />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
```

We received this response (JSON data):

```
config: {url: "https://jsonplaceholder.typicode.com/posts", method: "get", headers: {…}, transformRequest: Array(1), transformResponse: Array(1), …}
data: (100) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, ...]
headers: {cache-control: "max-age=43200", content-type: "application/json; charset=utf-8", expires: "-1", pragma: "no-cache"}
request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
status: 200
statusText: ""
```

### 5. Rendering Fetched Data to the Screen

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import axios from 'axios';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      console.log('resp: ', response);
      this.setState({ posts: response.data });
    });
  }

  render() {
    const posts = this.state.posts.map((post) => {
      return <Post key={post.id} title={post.title} />;
    });

    return (
      <div>
        <section className="Posts">{posts}</section>
        <section>
          <FullPost />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
```

### 6. Transforming Data

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import axios from 'axios';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      console.log('resp: ', response);
      const posts = response.data.slice(0, 4);
      const updatedPosts = posts.map((post) => {
        return {
          ...post,
          author: 'Max',
        };
      });
      this.setState({ posts: updatedPosts });
    });
  }

  render() {
    const posts = this.state.posts.map((post) => {
      return <Post key={post.id} title={post.title} author={post.author} />;
    });

    return (
      <div>
        <section className="Posts">{posts}</section>
        <section>
          <FullPost />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
```

### 7. Making a Post Selectable

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import axios from 'axios';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
  state = {
    posts: [],
    selectedPostId: null, // null by default but the id will be set as soon as we click on a post
  };

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      console.log('resp: ', response);
      const posts = response.data.slice(0, 4);
      const updatedPosts = posts.map((post) => {
        return {
          ...post,
          author: 'Max',
        };
      });
      this.setState({ posts: updatedPosts });
    });
  }

  postSelectedHandler = (id) => {
    this.setState({ selectedPostId: id }); // create this method which initiate the id (when we clicked on a post)
  };

  render() {
    const posts = this.state.posts.map((post) => {
      return (
        <Post
          key={post.id}
          clicked={() => this.postSelectedHandler(post.id)}
          title={post.title}
          author={post.author}
        />
      );
    });

    return (
      <div>
        <section className="Posts">{posts}</section>
        <section>
          <FullPost id={this.state.selectedPostId} />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
```

```js
// src/components/FullPost/FullPost.js
import React, { Component } from 'react';

import './FullPost.css';

class FullPost extends Component {
  render() {
    let post = <p style={{ textAlign: 'center' }}>Please select a Post!</p>;
    if (this.props.id) {
      post = (
        <div className="FullPost">
          <h1>Title</h1>
          <p>Content</p>
          <div className="Edit">
            <button className="Delete">Delete</button>
          </div>
        </div>
      );
    }
    return post;
  }
}

export default FullPost;
```

### 8. Fetching Data on Update (without Creating Infinite Loops)

Let's send an HTTP request once we got a valid post id. Which lifecycle hook should we use here?

`componentDidUpdate` is **a good place for causing side effects**, it also has one issue though. If we update the state, we update the component again and we therefore enter **an infinite loop**...

```js
// src/components/FullPost/FullPost.js
import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
  state = {
    loadedPost: null,
  };

  componentDidUpdate() {
    const { id } = this.props;
    const { loadedPost } = this.state;

    // the followinf condition prevent to enter in an infinite loop
    if ((id && !loadedPost) || (loadedPost && loadedPost.id !== id)) {
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((response) => {
          this.setState({ loadedPost: response.data });
        });
    }
  }

  render() {
    let post = <p style={{ textAlign: 'center' }}>Please select a Post!</p>;
    if (this.props.id) {
      post = <p style={{ textAlign: 'center' }}>Loading...</p>;
    }
    if (this.state.loadedPost) {
      post = (
        <div className="FullPost">
          <h1>{this.state.loadedPost.title}</h1>
          <p>{this.state.loadedPost.body}</p>
          <div className="Edit">
            <button className="Delete">Delete</button>
          </div>
        </div>
      );
    }
    return post;
  }
}

export default FullPost;
```

### 9. POSTing Data to the Server

```js
// src/components/NewPost/NewPost.js
import React, { Component } from 'react';
import axios from 'axios';

import './NewPost.css';

class NewPost extends Component {
  state = {
    title: '',
    content: '',
    author: 'Max',
  };

  // POST
  postDataHandler = () => {
    const { title, content, author } = this.state;
    const post = {
      title,
      content,
      author,
    };
    axios
      .post('https://jsonplaceholder.typicode.com/posts', post)
      .then((response) => {
        console.log('response: ', response);
      });
  };

  render() {
    return (
      <div className="NewPost">
        <h1>Add a Post</h1>
        <label>Title</label>
        <input
          type="text"
          value={this.state.title}
          onChange={(event) => this.setState({ title: event.target.value })}
        />
        <label>Content</label>
        <textarea
          rows="4"
          value={this.state.content}
          onChange={(event) => this.setState({ content: event.target.value })}
        />
        <label>Author</label>
        <select
          value={this.state.author}
          onChange={(event) => this.setState({ author: event.target.value })}
        >
          <option value="Max">Max</option>
          <option value="Manu">Manu</option>
        </select>
        <button onClick={this.postDataHandler}>Add Post</button>
      </div>
    );
  }
}

export default NewPost;
```

### 10. Sending a DELETE Request

```js
// src/components/FullPost/FullPost.js
import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
  state = {
    loadedPost: null,
  };

  componentDidUpdate() {
    const { id } = this.props;
    const { loadedPost } = this.state;

    if ((id && !loadedPost) || (loadedPost && loadedPost.id !== id)) {
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((response) => {
          this.setState({ loadedPost: response.data });
        });
    }
  }

  // DELETE
  deletePostHandler = () => {
    const { id } = this.props;
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => {
        console.log('response: ', response);
      });
  };

  render() {
    let post = <p style={{ textAlign: 'center' }}>Please select a Post!</p>;
    if (this.props.id) {
      post = <p style={{ textAlign: 'center' }}>Loading...</p>;
    }
    if (this.state.loadedPost) {
      post = (
        <div className="FullPost">
          <h1>{this.state.loadedPost.title}</h1>
          <p>{this.state.loadedPost.body}</p>
          <div className="Edit">
            <button onClick={this.deletePostHandler} className="Delete">
              Delete
            </button>
          </div>
        </div>
      );
    }
    return post;
  }
}

export default FullPost;
```

### 11. Handling Errors Locally

We also need to know how we may **handle errors**!

```js
import React, { Component } from 'react';
import axios from 'axios';

import Post from '../../components/Post/Post';
import FullPost from '../../components/FullPost/FullPost';
import NewPost from '../../components/NewPost/NewPost';
import './Blog.css';

class Blog extends Component {
  state = {
    posts: [],
    selectedPostId: null,
    error: false, // we can set up an error property in our state
  };

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        // console.log('resp: ', response);
        const posts = response.data.slice(0, 4);
        const updatedPosts = posts.map((post) => {
          return {
            ...post,
            author: 'Max',
          };
        });
        this.setState({ posts: updatedPosts });
      })
      .catch((error) => {
        // we catch the error and we change the state
        console.log(error);
        this.setState({ error: true });
      });
  }

  postSelectedHandler = (id) => {
    this.setState({ selectedPostId: id });
  };

  render() {
    let posts = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;
    // we display a message if there is an error
    if (!this.state.error) {
      posts = this.state.posts.map((post) => {
        return (
          <Post
            key={post.id}
            clicked={() => this.postSelectedHandler(post.id)}
            title={post.title}
            author={post.author}
          />
        );
      });
    }

    return (
      <div>
        <section className="Posts">{posts}</section>
        <section>
          <FullPost id={this.state.selectedPostId} />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
```

### 12. Adding Interceptors to Execute Code Globally

**Handling errors locally** in components makes sense because we probably want to do different things with errors depending on the component. But sometimes, we want to **execute some code/handling error globally**. We can do it with `axios` with the help of so-called **interceptors**, these are functions we can **define globally** which will **be executed for every request** leaving your app and **every response** returning into it. This is especially useful for _setting some common headers like authorization header_ maybe or for responses if you want to _log responses or want to handle errors globally_.

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => {
    console.log('response: ', response);
    // edit the response config before we return it
    return response;
  },
  (error) => {
    console.log('error: ', error);
    // handle the error globally (e.g. we want to log the error in the log file which we send to a server...)
    return Promise.reject(error);
  },
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```

### 13. Removing Interceptors

```js
const myInterceptor = axios.interceptors.request.use((request) => {
  /*...*/
});
axios.interceptors.request.eject(myInterceptor);
```

### 14. Setting a Default Global Configuration for Axios

```js
// src/index.js
//...
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'; // allow us to only call `axios.post('/posts', post).then((response) => {...});
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json'; // useless here because it's default behaviour
//...
```

### 15. Creating and Using Axios Instances

Being able to set a **default configuration** for `axios` is pretty awesome but what if we actually don't want to use the same `baseURL` for our entire application but only for parts of it? In such a case, we can do an half measure by creating a cool feature provided by axios which is called **instances**.

Let's create a `axios.js` file in our `/src` folder.

```js
// src/axios.js
import axios from 'axios';

// we create an instance from axios
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
```

Then, it is super easy to use it...

```js
import React, { Component } from 'react';
// import axios from 'axios'; // we don't want to use axios from axios
import axios from '../../axios'; // but axios from our instance (we just created)

//...

export default Blog;
```

It allows us to control in detail in which part of our app we want to use which default settings.
