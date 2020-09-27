import React, { Component } from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import Posts from './Posts/Posts';
// import NewPost from './NewPost/NewPost';
import './Blog.css';
import asyncComponent from '../../hoc/asyncComponent';
const AsyncNewPost = asyncComponent(() => {
  return import('./NewPost/NewPost');
});

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
                    hash: '#submit', // just an example, to jump to this anchor
                    search: '?quick-submit=true', // another example of what we can do
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
          {/* <Route render={() => <h1>Not Found</h1>} /> */}
        </Switch>
      </div>
    );
  }
}

export default Blog;
