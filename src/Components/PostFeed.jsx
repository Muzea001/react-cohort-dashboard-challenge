import React, { useEffect, useState } from 'react';
import Post from './Post';
import CreatePost from './CreatePost';

function PostFeed({ username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [username]);

  const fetchPosts = () => {
    fetch(`https://boolean-uk-api-server.fly.dev/${username}/post`)
      .then(response => response.json())
      .then(data => setPosts(data));
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="posts-list">
      <CreatePost username={username} onPostCreated={handlePostCreated} />
      <h2>Post Feed</h2>
      <ul className='posts-ul'>
      {posts.map(post => (
        <Post key={post.id} post={post} username={username} />
      ))}
      </ul>
    </div>
  );
}

export default PostFeed;