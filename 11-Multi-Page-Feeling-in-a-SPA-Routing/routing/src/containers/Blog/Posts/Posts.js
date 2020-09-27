import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from '../../../axios';
import FullPost from '../FullPost/FullPost';
import Post from '../../../components/Post/Post';
import './Posts.css';

class Posts extends Component {
  state = {
    posts: [],
  };

  componentDidMount() {
    console.log('props: ', this.props);
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
    this.props.history.push({ pathname: '/posts/' + id });
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
