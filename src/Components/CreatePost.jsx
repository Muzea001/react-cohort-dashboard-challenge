import { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function CreatePost({ username, onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      title,
      content,
      contactId: 1, 
      authorName: 'Jacinto Botsford', 
      authorInitials: 'JB', 
      authorColor: '#36a093', 
      comments: []
    };

    fetch(`https://boolean-uk-api-server.fly.dev/${username}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        onPostCreated(data); 
        navigate(`/`);
      });
  };

  return (
    <div className="post-box">
      <h2>Create Post</h2>
      <form id="create-post" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            name="postContent"
            placeholder="What's on your mind?"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;