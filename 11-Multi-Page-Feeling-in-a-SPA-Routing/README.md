# Multi-Page-Feeling in a Single-Page-App: Routing

_Useful Resources & Links_

- [React Router Docs](https://reacttraining.com/react-router/web/guides/philosophy)

### 1. Module Introduction

**Routing is not built into the core of React**. We'll use another package which is not created by Facebook but the de-facto standard for this task in this module. React at its core is just a component creation library, now we're turning it to much more like a framework by adding a major feature, **routing**.

### 2. Routing and SPAs

**Routing** is about **being able to show different pages to the user**.

We may wonder **multiple pages in a single page application**, how does that work together? 🤔

**A SPA is a single HTML file**. We still want to provide the user with a normal web experience though, we want to show the user different pages for different URLs. **The trick is that we don't actually have multiple HTML files**, but instead **we use JavaScript to render different pages for different paths**. This is what routing is about, parsing a path, so the path after our domain and showing the appropriate JSX or component code in our app.

We're going to use a **router package**, so that we don't have to parse that path on our own which is non-trivial. That router package has a couple of tasks, first of all of course it has to **parse the URL path** to understand where the user wanted to go to. Then the router package can **read our configuration** basically, so that it knows which paths are supported and what should happen when the user visits one of these paths. And lastly, it will render or **load the appropriate JSX or component code** depending on which path the user visited.

### 3. Setting Up Links

```js
//
import React, { Component } from 'react';
//...

class Blog extends Component {
  //...
  render() {
    //...
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/new-post">New Post</a>
              </li>
            </ul>
          </nav>
        </header>
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

### 4. Setting Up the Router Package

```sh
yarn add react-router react-router-dom
```

We need to enable the routing in our app. We need to import `BrowserRouter` from `react-router-dom` and wrap the parent components, so any subcomponents can use the routing.

```js
// src/App.js
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Blog from './containers/Blog/Blog';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Blog />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
```

### 5. react-router vs react-router-dom

We installed both `react-router` and `react-router-dom`. Technically, only `react-router-dom` is **required for web development**. It wraps **react-router** and therefore uses it as a dependency.

**We don't need to install `react-router` on our own for it to work**. We can omit this installation step, I left it in there for historic reasons and because I like to emphasize that the main package is named `react-router`. If you ever search for assistance, you probably want to search for "`react router`" - that's the name of the package.

### 6. Preparing the Project For Routing

We need to create a `Posts` component (and restructure a bit the project).

```js
// src/containers/Blog/Posts/Posts.js
import React, { Component } from 'react';
import axios from '../../../axios';
import Post from '../../../components/Post/Post';
import './Posts.css';

class Posts extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    axios
      .get('/posts')
      .then((response) => {
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
        console.log(error);
      });
  }

  postSelectedHandler = (id) => {
    this.setState({ selectedPostId: id });
  };

  render() {
    let posts = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;

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
    return <section className="Posts">{posts}</section>;
  }
}

export default Posts;
```

And now `Blog` looks like this:

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import Posts from './Posts/Posts';

import './Blog.css';

class Blog extends Component {
  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/new-post">New Post</a>
              </li>
            </ul>
          </nav>
        </header>
        <Posts />
      </div>
    );
  }
}

export default Blog;
```

### 7. Setting Up and Rendering Routes

We can use mutliple `Route` element when we specify a `path` and then we can use `render`.

```js
<Route path="/" render={() => <h1>Home 1</h1>} /> // every url which match with "/"
<Route path="/" exact render={() => <h1>Home 2</h1>} /> // exact – only this "/"
```

```js
import React, { Component } from 'react';
import Posts from './Posts/Posts';
import { Route } from 'react-router-dom';

import './Blog.css';

class Blog extends Component {
  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/new-post">New Post</a>
              </li>
            </ul>
          </nav>
        </header>
        <Route path="/" render={() => <h1>Home 1</h1>} />
        <Route path="/" exact render={() => <h1>Home 2</h1>} />
      </div>
    );
  }
}

export default Blog;
```

### 8. Rendering Components for Routes

```js
<Route path="/" exact component={Posts} />
```

### 9. Switching Between Pages

It works, but there is a problem...Each time we click on our navbar, **the page reload**! And reloading the application means that our JavaScript code is starting anew and therefore **all previous application state is lost**.

We do not want to reload the page, we want to re-render the page in the parts where it needs to be re-rendered to look like the new page.

```js
//...
<Route path="/" exact component={Posts} />
<Route path="/new-post" component={NewPost} />
//...
```

### 10. Using Links to Switch Pages

We want to make sure that we stay inside the application when clicking on links.

`<Link to="/">XXX</Link>` is essentially the same as `<a href="/">XXX</a>` but React Router will create the anchor tag and then `preventdefault` which would prevent to send a new request and instead handle that click on itself that is why we need to use link.

```js
import React, { Component } from 'react';
import Posts from './Posts/Posts';
import NewPost from './NewPost/NewPost';
import { Link, Route } from 'react-router-dom';

import './Blog.css';

class Blog extends Component {
  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: '/new-post',
                    hash: '#submit', // just an example, to jump to this anchor
                    search: '?quick-submit=true', // another example of what we can do
                  }}
                >
                  New Post
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <Route path="/" exact component={Posts} />
        <Route path="/new-post" component={NewPost} />
      </div>
    );
  }
}

export default Blog;
```

### 11. Using Routing-Related Props

Right now, we are able to navigate around (and without reloading the page). Now let's have a look at **the information we actually get in the components** we're loading because **React Router** gives us extra information about the loaded route through `props`.

Let's display the props from the `Posts` component.

```
history: {length: 16, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
location: {pathname: "/", search: "", hash: "", state: undefined, key: "cmb1r2"}
match: {path: "/", url: "/", isExact: true, params: {…}}
staticContext: undefined
__proto__: Object
```

### 12. The "withRouter" HOC & Route Props

What if we want to get information about the router not in one of our containers (meaning: not in a component which was loaded through a route as defined in the `Blog.js` file) but in a component which is rendered as part of such a container, like the `Post` container.

There is two ways to pass the information from `Posts` to `Post`.

1. We can pass them on **with the spread operator** `{...this.props}`, as a result it passes any props this post container has onto the post component.
2. Our using an HOC – `withRouter` from `react-router-dom`.

```js
// src/components/Post/Post.js
import React from 'react';
import { withRouter } from 'react-router-dom';

import './Post.css';

const post = (props) => (
  <article className="Post" onClick={props.clicked}>
    <h1>{props.title}</h1>
    <div className="Info">
      <div className="Author">{props.author}</div>
    </div>
  </article>
);

export default withRouter(post); // HOC which we use by wrapping our export component
```

`withRouter` adds the `props` (linked to the route) to other components, to any component we wrap with it. Making that component route aware and it will use or it will get the props containing information for the nearest loaded route.

### 13. Absolute vs Relative Paths

An **absolute path** is always appended to our domain, so if we're serving this app from [example.com](example.com) then you want to go to `/new-post`, if we navigate to `/new-post`, that simply means always attach `/new-post` right after the domain.

Now what if we wanted to turn a link into a **relative path**? If we wanted to make sure that if you are on your `domain/posts`, you actually go to our domain `/posts/new-posts`, so we append our _link path_ to the end of the current path.

Then we actually need to build this path dynamically by taking into advantage that we know at which path we are currently on.

```js
//...
<li>
  <Link
    to={{
      pathname: this.props.match.url + '/new-post', // now it is a relative path
      hash: '#submit',
      search: '?quick-submit=true',
    }}
  >
    New Post
  </Link>
</li>
//...
```

### 14. Absolute vs Relative Paths (Article)

We learned about `<Link>`, we learned about the `to` property it uses. The path we can use in to can be either **absolute** or **relative**.

#### Absolute Paths

By default, if we just enter `to="/some-path"` or `to="some-path"`, that's an **absolute path**.

**Absolute path** means that it's **always appended right after our domain**. Therefore, both syntaxes (with and without leading slash) lead to `example.com/some-path`.

#### Relative Paths

Sometimes, we might want to create a relative path instead. This is especially useful, if our component is already loaded given a specific path (e.g. `posts`) and we then want to append something to that existing path (so that we, for example, get `/posts/new`).

If we're on a component loaded via `/posts`, `to="new"` would lead to `example.com/new`, **NOT** `example.com/posts/new`.

To change this behavior, we have to find out which path we're on and add the new fragment to that existing path. We can do that with the `url` property of `props.match`:

`<Link to={props.match.url + '/new'}>` will lead to `example.com/posts/new` when placing this link in a component loaded on `/posts`. If we'd use the same `<Link>` in a component loaded via `/all-posts`, the link would point to `/all-posts/new`.

### 15. Styling the Active Route

We need to replace `Link` with `NavLink`.

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import Posts from './Posts/Posts';
import NewPost from './NewPost/NewPost';
import { NavLink, Route } from 'react-router-dom';

import './Blog.css';

class Blog extends Component {
  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <NavLink to="/" exact>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{
                    pathname: '/new-post',
                    hash: '#submit',
                    search: '?quick-submit=true',
                  }}
                >
                  New Post
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Route path="/" exact component={Posts} />
        <Route path="/new-post" component={NewPost} />
      </div>
    );
  }
}

export default Blog;
```

The **active route** which is `/new-post` has changed and has an active class added now.

```css
/* src/containers/Blog/Blog.css */
.Blog a:hover,
.Blog a:active,
.Blog a.active {
  color: #fa923f;
}
```

We could also add an active class name:

```js
<NavLink to="/" exact activeClassName="my-active-classname">
  Home
</NavLink>
```

Our we could add an active style as well:

```js
<NavLink
  to="/"
  exact
  activeClassName="my-active-classname"
  activeStyle={{ color: 'red', textDecoration: 'underline' }}
>
  Home
</NavLink>
```

### 16. Passing Route Parameters

We need to be able to get dynamic routing parameter if we want to display a single posts. Using the id to get our post.

```js
// src/containers/Blog/Blog.js
//...
<Route path="/" exact component={Posts} />
<Route path="/new-post" exact component={NewPost} />
<Route path="/post/:id" exact component={FullPost} />
//...
```

```js
// src/containers/Blog/Posts/Posts.js
//...
  render() {
    let posts = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;

    if (!this.state.error) {
      posts = this.state.posts.map((post) => {
        return (
          <Link key={post.id} to={`/post/${post.id}`}>
            <Post
              clicked={() => this.postSelectedHandler(post.id)}
              title={post.title}
              author={post.author}
            />
          </Link>
        );
      });
    }
    return <section className="Posts">{posts}</section>;
  }
//...
```

### 17. Extracting Route Parameters

```js
import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
  state = {
    loadedPost: null,
  };

  // replace componentDidUpdate with componentDidMount
  componentDidMount() {
    // now we have access to this.props.match.params to get our id
    const { id } = this.props.match.params;
    const { loadedPost } = this.state;

    if ((id && !loadedPost) || (loadedPost && loadedPost.id !== id)) {
      axios.get(`/posts/${id}`).then((response) => {
        this.setState({ loadedPost: response.data });
      });
    }
  }

  //...
}

export default FullPost;
```

### 18. Parsing Query Parameters & the Fragment

But how do we extract **search** (also referred to as "**query**") **parameters** (=> `?something=somevalue` at the end of the URL)? How do we extract the **fragment** (=> `#something` at the end of the URL)?

#### Query Params

We can pass them easily like this: `<Link to="/my-path?start=5">Go to Start</Link>` or

```js
<Link
    to={‌{
        pathname: '/my-path',
        search: '?start=5'
    }}
    >Go to Start</Link>
```

React router makes it easy to get access to the search string: `props.location.search`. But that will only give us something like `?start=5`.

We probably want to get the key-value pair, without the `?` and the `=`. Here's a snippet which allows us to easily extract that information:

```js
componentDidMount() {
  const query = new URLSearchParams(this.props.location.search);
  for (let param of query.entries()) {
    console.log(param); // yields ['start', '5']
  }
}
```

`URLSearchParams` is a built-in object, shipping with vanilla JavaScript. It returns an object, which exposes the `entries()` method. `entries()` returns an Iterator - basically a construct which can be used in a `for...of...` loop (as shown above).

When looping through `query.entries()`, we get **arrays** where the first element is the **key name** (e.g. `start`) and the second element is the assigned value (e.g. `5`).

#### Fragment

You can pass it easily like this: `<Link to="/my-path#start-position">Go to Start</Link>` or

```js
<Link
    to={‌{
        pathname: '/my-path',
        hash: 'start-position'
    }}
    >Go to Start</Link>
```

React router makes it easy to extract the fragment. We can simply access `props.location.hash`.

### 19. Using Switch to Load a Single Route

We can tell React Router to load only one of all these routes at a time, by wrapping our route config with another component provided by the `react-router-dom` package, this is the `Switch` component.

`Switch` tells the React Router: "_please only load one of the routes_". The first one actually it finds that matches from a given set of routes.

```js
<Switch>
  <Route path="/" exact component={Posts} />
  <Route path="/new-post" exact component={NewPost} />
  <Route path="/:id" exact component={FullPost} />
</Switch>
```

### 20. Navigating Programmatically

How to navigate **without using `Link`** but **programmatically**?

Sometimes we have use cases where we want to navigate after something finished, after a HTTP request was sent for example. In the `props` we have the `history` and there we have a lot of functions we can execute. **Functions for navigating around** like `goBack` or `goForward`, which do exactly what they sound like, they basically do the same we have with the forward and backward buttons.

There also is this `push` method which allows us to push a new page onto the **stack of pages** because navigation basically just is about a stack of pages.

```js
//
import React, { Component } from 'react';
import axios from '../../../axios';
import Post from '../../../components/Post/Post';
import './Posts.css';

class Posts extends Component {
  state = {
    posts: [],
  };

  //...

  postSelectedHandler = (id) => {
    this.props.history.push({ pathname: '/' + id }); // we can navigate programmatically
    // this.props.history.push('/' + id); // or this work too
  };

  render() {
    let posts = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;

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
    return <section className="Posts">{posts}</section>;
  }
}

export default Posts;
```

It is mostly used when we want to wait until an important operation finish before we route.

### 21. Additional Information Regarding Active Links

```js
<li>
  <NavLink to="/" exact>
    Home
  </NavLink>
</li>
```

We could face issues when using the **root path** (as above), just a slash and we want to style some child components but not all of them. So, some paths which follow it (like `/3`) but not all paths, we typically use more specific routes like `/posts` though so this shouldn't be an issue.

### 22. Understanding Nested Routes

Sometimes we also have a set up where we want to create **a nested route**. So where we want to load a certain component or where we want to render certain content inside of another component which is also loaded via routing.

Let's say we want to load a specific `Post` not inside the blog component but inside the `Posts` component right beneath our `posts`.

```js
// src/containers/Blog/Blog.js
<Switch>
  <Route path="/new-post" exact component={NewPost} />
  <Route path="/posts" component={Posts} />
</Switch>
```

```js
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
//...

class Posts extends Component {
  //...
  render() {
    //...
    return (
      <div>
        <section className="Posts">{posts}</section>
        <Route
          path={this.props.match.url + '/:id'}
          exact
          component={FullPost}
        />
      </div>
    );
  }
}

export default Posts;
```

As we can see, it is a nested route and we handle it dynamically with `this.props.match.url`.

### 23. Creating Dynamic Nested Routes

But we got a problem... it is registering the click but it isn't loading the new component. The reason for this is that **React Router behind the scenes doesn't replace the component all the time**.

The component itself didn't change! It would be very inefficient to unmount it and remount it. Since `componentsDidMount` isn't executed again though, we're not render it again. To fix this, we should implement `componentDidUpdate` to handle this case because it will be executed again.

```js
// src/containers/Blog/FullPost/FullPost.js
import React, { Component } from 'react';
import axios from 'axios';

import './FullPost.css';

class FullPost extends Component {
  state = {
    loadedPost: null,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  loadData() {
    const { id } = this.props.match.params;
    const { loadedPost } = this.state;

    if ((id && !loadedPost) || (loadedPost && loadedPost.id !== +id)) {
      // the check is very important (adding a + to transform into a number)
      axios.get(`/posts/${id}`).then((response) => {
        this.setState({ loadedPost: response.data });
      });
    }
  }

  deletePostHandler = () => {
    const { id } = this.props.match.params;
    axios.delete(`/posts/${id}`).then((response) => {
      console.log('response: ', response);
    });
  };

  render() {
    const { id } = this.props.match.params;
    let post = <p style={{ textAlign: 'center' }}>Please select a Post!</p>;
    if (id) {
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

### 24. Redirecting Requests

This of course works and there's nothing wrong with it, we can definitely **have multiple routes with different paths which render the same content**, that's absolutely fine.

```js
//...
<Switch>
  <Route path="/new-post" exact component={NewPost} />
  <Route path="/posts" component={Posts} />
  <Route path="/" component={Posts} />
</Switch>
//...
```

We can also use `Redirect`:

```js
<Switch>
  <Route path="/new-post" exact component={NewPost} />
  <Route path="/posts" component={Posts} />
  <Redirect from="/" to="/posts" />
</Switch>
```

This is how we can redirect to ensure that the user is navigated to the route we want to have him on.

### 25. Conditional Redirects

Let's see another usage of `Redirect`. When we create a new post, we probably want to redirect once we clicked the submit button and once we made our HTTP request. We often then want to change the page and not remain on that page. Using the redirect component.

```js
// src/containers/Blog/NewPost/NewPost.js
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
//...

class NewPost extends Component {
  state = {
    //...
    submitted: false, // let's setup a condition for our redirect
  };

  postDataHandler = () => {
    const { title, content, author } = this.state;
    const post = {
      title,
      content,
      author,
    };
    axios.post('/posts', post).then((response) => {
      this.setState({ submitted: true }); // HTTP request done, now let's redirect
    });
  };

  render() {
    let redirect = null;
    if (this.state.submitted) {
      redirect = <Redirect to="/posts" />; // REDIRECT
    }
    return (
      <div className="NewPost">
        {redirect}
        <h1>Add a Post</h1>
        {...}
      </div>
    );
  }
}

export default NewPost;
```

### 26. Using the History Prop to Redirect (Replace)

```js
// src/containers/Blog/NewPost/NewPost.js
//...
postDataHandler = () => {
  const { title, content, author } = this.state;
  const post = {
    title,
    content,
    author,
  };
  axios.post('/posts', post).then((response) => {
    this.props.history.push('/posts'); // here is the ≠
  });
};
//...
```

Technically, `push` pushes the page onto the stack, so if we click the back button, we go back to the new post page. Whereas redirect replaces the current page. So, **if we click the back button after redirecting and not by pushing**, we can go back but you won't go back to the last page because redirect replaces the current page on the stack `this.props.history.replace('/posts');`. It doesn't push a new one. Though you can also replicate this behavior by not using push but replace on the history object.

### 27. Working with Guards

Let's talk about **navigation guards**. Typically guards is for example used when we don't know whether the user is authenticated or not. And there are some paths in our application, some routes we only want to allow the user to visit if he is authenticated. We can simply render a component conditionally.

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import Posts from './Posts/Posts';
import NewPost from './NewPost/NewPost';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

//...

class Blog extends Component {
  state = {
    auth: false,
  };

  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            {...}
          </nav>
        </header>
        <Switch>
          {this.state.auth ? ( // here is a guard
            <Route path="/new-post" exact component={NewPost} />
          ) : null}
          <Route path="/posts" component={Posts} />
          <Redirect from="/" to="/posts" />
        </Switch>
      </div>
    );
  }
}

export default Blog;
```

OR

```js
// src/containers/Blog/NewPost/NewPost.js
//...
  componentDidMount() {
    // just as an example
    if (unauth) {
      this.props.history.replace('/posts');
    }
  }
//...
```

### 28. Handling the 404 Case (Unknown Routes)

Add a `Route` (should always come last) without `path` and a component or like here, a render function.

```js
// src/containers/Blog/Blog.js
//...
<Switch>
  {this.state.auth ? (
    <Route path="/new-post" exact component={NewPost} />
  ) : null}
  <Route path="/posts" component={Posts} />
  <Route render={() => <h1>Not Found</h1>} />
</Switch>
//...
```

### 29. Loading Routes Lazily

When we look at the Chrome Dev Tools – Network. We can see we're loading a `bundle.js` file.

Loading the entire bundle with all the code of our application up front can be bad if we have a big application with distinct features and distinct areas in the app where a user might never visit a certain area. If the user never visits new post, loading the code responsible for that component doesn't make a lot of sense.

Why should we download the code up front? Would it be better to not download it and hence have a smaller upfront chunk to download and instead download the code responsible for this component and its children when needed.

The technique of downloading only what we need is known as code splitting or lazy loading and there we would essentially want to make sure that in our component, we're only loading the component once you need it.

This technique will work for React Router 4 (at least) and for create-react-app because code splitting depends heavily on the **webpack configuration we are using**, it is an advanced concept after all.

First of all, let's create a HOC `asyncComponent`:

```js
// src/hoc/AsyncComponent.js
import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
  return class extends Component {
    state = {
      component: null,
    };

    componentDidMount() {
      importComponent().then((cmp) => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  };
};

export default asyncComponent;
```

```js
// src/containers/Blog/Blog.js
import React, { Component } from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import Posts from './Posts/Posts';
// import NewPost from './NewPost/NewPost'; // OLD WAY
import './Blog.css';
import asyncComponent from '../../hoc/asyncComponent'; // NEW WAY
const AsyncNewPost = asyncComponent(() => {
  return import('./NewPost/NewPost');
});

// NO IMPORT AFTER THE ABOVE

class Blog extends Component {
  state = {
    auth: true,
  };

  render() {
    return (
      <div className="Blog">
        <header>
          <nav>
            <ul>
              <li>
                <NavLink to="/posts/" exact>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{
                    pathname: '/new-post',
                    hash: '#submit',
                    search: '?quick-submit=true',
                  }}
                >
                  New Post
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          {this.state.auth ? (
            <Route path="/new-post" exact component={AsyncNewPost} />
          ) : null}
          <Route path="/posts" component={Posts} />
          <Redirect from="/" to="/posts" />
        </Switch>
      </div>
    );
  }
}

export default Blog;
```

This is **extremely useful in bigger apps where there are bigger chunks of code**, a whole feature area in our application for example which **might not even be visited by the user so we can save that code up front to only load it when needed**.

### 30. Lazy Loading with React Suspense (16.6)

If we're using **React 16.6**, we get access to **React lazy**. It allows us to **load components asynchronously** which means they are only loading the code behind them is only loaded when they are really required when they are being rendered.

And that of course means that **we don't load redundant code in advance**. It's not just useful for routing. By the way whenever we have a use case whereas some components are loaded at a later point of time for example because _we have a check and some conditions need to be met to render a certain component in all such cases we could use React Lazy_.

```js
// routing-with-suspense/src/App.js
import React, { Component, Suspense } from 'react'; // import Suspense
import { BrowserRouter, Route, NavLink } from 'react-router-dom';

import User from './containers/User';
import Welcome from './containers/Welcome';
const Posts = React.lazy(() => import('./containers/Posts')); // using React.lazy

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <nav>
            <NavLink to="/user">User Page</NavLink> |&nbsp;
            <NavLink to="/posts">Posts Page</NavLink>
          </nav>
          <Route path="/" component={Welcome} exact />
          <Route path="/user" component={User} />
          <Route
            path="/posts"
            render={() => (
              <Suspense fallback={<div>Loading...</div>}>
                <Posts />
              </Suspense>
            )}
          />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
```

We use `render` which return a function where we return `Suspense` (adding a fallback, when loading...) and our lazy Posts in between.

```js
//...
<Route
  path="/posts"
  render={() => (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts />
    </Suspense>
  )}
/>
//...
```

OR conditionally

```js
// routing-with-suspense/src/App.js
import React, { Component, Suspense } from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';

import User from './containers/User';
const Posts = React.lazy(() => import('./containers/Posts'));

class App extends Component {
  state = { showPosts: false };

  clickHandler = () => {
    this.setState((prevState) => {
      return { showPosts: !prevState.showPosts };
    });
  };

  render() {
    const { showPosts } = this.state;
    return (
      <React.Fragment>
        <button onClick={this.clickHandler}>Toggle Mode</button>
        {showPosts ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Posts />
          </Suspense>
        ) : (
          <User />
        )}
      </React.Fragment>
    );
  }
}

export default App;
```

Now of course one thing to keep in mind the benefit we will get out of this will be greater if we have larger chunks of data behind our components. If we have very simple components using `Suspense` might actually be overkill and could even slow down our application or be suboptimal. At this point of time so lazy loading the code of course shows its full strength. If we're talking about bigger chunks of code.

### 31. Routing and Server Deployment

There's one important thing we have to know regarding routing when using the React Router, when it comes to deploying our app to a real server because we won't notice on the development server because it's already configured correctly.

We have the user who sends a request to the server and we have our React app which is loaded on the `index.html` page. But before we load to `index.html` page the server needs to find out which page the user actually wanted to visit.

**The problem is it's the React app which knows the routes**. So if we visit `/posts`, there is no `/posts` route on our server, that is defined in the JavaScript code which is loaded on the `index.html` page which we never get because we get a 404 error on the server because we tried to visit a route which is unknown to the server.

We have to configure the server in a way that it always forwards requests no matter if it understands them or not, so also 404 error requests to the client, so that it always returns the `index.html` page, also for unknown requests because this then allows React to take over and parse the request against the routes it knows.

If we're serving our app from let's say `example.com/myapp`, so anything beneath that folder should be our React app, we need to tell React about this, the React Router to be precise. You need to set the base path for the React Router.

```js
//...
class App extends Component {
  render() {
    return (
      // <BrowserRouter basename="/"> // default
      // below used for /my-app
      <BrowserRouter basename="/my-app">
        {...}
      </BrowserRouter>
    );
  }
}
//...
```
