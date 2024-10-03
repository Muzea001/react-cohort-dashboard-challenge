import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import CreateComment from './CreateComment';

function Post({ post, username }) {
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    // Fetch author details
    fetch(`https://boolean-uk-api-server.fly.dev/${username}/contact/${post.contactId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setAuthor(data))
      .catch(error => setError(error));

    // Fetch comments
    fetchComments();
  }, [post, username]);

  const fetchComments = () => {
    fetch(`https://boolean-uk-api-server.fly.dev/${username}/post/${post.id}/comment`)
      .then(response => response.json())
      .then(data => {
        // Sort comments by ID in descending order
        const sortedComments = data.sort((a, b) => b.id - a.id);
        setComments(sortedComments);
      })
      .catch(error => setError(error));
  };

  const handleCommentCreated = () => {
    fetchComments();
  };

  const toggleCommentsVisibility = () => {
    setShowAllComments(!showAllComments);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!author) {
    return <div>Loading...</div>;
  }

    return (
    <li className="posts">
      <div>
        <div className="user-info">
          <h1>{author.firstName} {author.lastName}</h1>
          <h2>
            <Link to={`/post/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          <p>{post.content}</p>
        </div>
      </div>
      <div className="comments">
        {(showAllComments ? comments : comments.slice(0, 3)).map(comment => (
          <Comment key={comment.id} comment={comment} username={username} />
        ))}
        {comments.length > 3 && !showAllComments && (
          <button className="previous-comments" onClick={toggleCommentsVisibility}>See previous comments</button>
        )}
      </div>
      <CreateComment postId={post.id} username={username} onCommentCreated={handleCommentCreated} />
    </li>
  );
}

export default Post;