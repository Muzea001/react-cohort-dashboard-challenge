import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import CreateComment from './CreateComment';

function PostDetail({ username }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState({
    title: '',
    content: '',
    contactId: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://boolean-uk-api-server.fly.dev/${username}/post/${postId}`);
        console.log('Response:', response); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data:', data);
        setPost(data);
        setUpdatedPost({ title: data.title, content: data.content, contactId: data.contactId });
        if (data.contactId) {
          fetchAuthor(data.contactId);
        } else {
          throw new Error('Contact ID is missing in the post data');
        }
        fetchComments();
      } catch (error) {
        console.error('Error fetching post:', error); 
        setError(error);
      }
    };

    fetchPost();
  }, [postId, username]);

  const fetchAuthor = async (contactId) => {
    try {
      const response = await fetch(`https://boolean-uk-api-server.fly.dev/${username}/contact/${contactId}`);
      const data = await response.json();
      setAuthor(data);
    } catch (error) {
      console.error('Error fetching author:', error);
      setError(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://boolean-uk-api-server.fly.dev/${username}/post/${postId}/comment`);
      const data = await response.json();
      const sortedComments = data.sort((a, b) => b.id - a.id);
      setComments(sortedComments);
    } catch (error) {
      setError(error);
    }
  };

  const handleCommentCreated = () => {
    fetchComments();
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = async () => {
    try {
      const url = `https://boolean-uk-api-server.fly.dev/${username}/post/${postId}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPost((prevPost) => ({
      ...prevPost,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `https://boolean-uk-api-server.fly.dev/${username}/post/${postId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Updated data:', data);
      setPost(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!post || !author) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post">
      <h1>{author.firstName} {author.lastName}</h1>
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={updatedPost.title} onChange={handleUpdateChange} />
          </div>
          <div>
            <label>Content:</label>
            <textarea name="content" value={updatedPost.content} onChange={handleUpdateChange} />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={handleEditClick}>Update</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </>
      )}
      <div className="comments">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            username={username}
            postId={Number(postId)} // Ensure postId is a number
            contactId={post.contactId} // Pass contactId as a prop
            onCommentUpdated={handleCommentUpdated}
            onCommentDeleted={handleCommentDeleted}
          />
        ))}
      </div>
      <CreateComment postId={post.id} username={username} onCommentCreated={handleCommentCreated} />
    </div>
  );
}

export default PostDetail;