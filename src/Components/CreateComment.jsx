import  { useState } from 'react';

function CreateComment({ postId, username, onCommentCreated }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      content,
      contactId: 1, 
      createdAt: new Date().toISOString(), 
      postId 
    };

    fetch(`https://boolean-uk-api-server.fly.dev/${username}/post/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    })
      .then(response => response.json())
      .then(() => {
        setContent("");
        onCommentCreated(); // Call the function to refresh comments
      });
  };

  return (
    <div className='add-comment'>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div className='comment-form'>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className='comment-submit' type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default CreateComment;