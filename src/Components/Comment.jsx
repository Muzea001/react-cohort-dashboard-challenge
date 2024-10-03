import React, { useState } from 'react';

function Comment({ comment, username, postId, contactId, onCommentUpdated, onCommentDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(comment.content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = async () => {
    try {
      const url = `https://boolean-uk-api-server.fly.dev/${username}/post/${postId}/comment/${comment.id}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      onCommentDeleted(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdatedComment(e.target.value);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `https://boolean-uk-api-server.fly.dev/${username}/post/${postId}/comment/${comment.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: updatedComment, postId: Number(postId), contactId }) // Ensure postId is a number
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      onCommentUpdated(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div className="comment-item">
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <textarea value={updatedComment} onChange={handleUpdateChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p>{comment.content}</p>
          <button onClick={handleEditClick}>Update</button>
          <button onClick={handleDeleteClick}>Delete</button>
        </>
      )}
    </div>
  );
}

export default Comment;