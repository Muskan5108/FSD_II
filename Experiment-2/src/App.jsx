import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./features/posts/postsSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [status, setStatus] = useState("Draft");

  const handleAddPost = () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    dispatch(
      addPost({
        id: Date.now(),
        title,
        content,
        platform,
        status,
      })
    );

    setTitle("");
    setContent("");
    setPlatform("LinkedIn");
    setStatus("Draft");
  };

  const totalPosts = posts.length;
  const published = posts.filter(
    (post) => post.status === "Published"
  ).length;
  const drafts = posts.filter(
    (post) => post.status === "Draft"
  ).length;
  const platforms = new Set(posts.map((post) => post.platform)).size;

  return (
    <div className="container">
      <div className="header">
        <h1>🚀 SocialSync Dashboard</h1>
        <p>Redux Toolkit Social Media Manager</p>
      </div>

      <div className="stats">
        <div className="card">
          <h2>{totalPosts}</h2>
          <p>Total Posts</p>
        </div>

        <div className="card">
          <h2>{published}</h2>
          <p>Published</p>
        </div>

        <div className="card">
          <h2>{drafts}</h2>
          <p>Drafts</p>
        </div>

        <div className="card">
          <h2>{platforms}</h2>
          <p>Platforms</p>
        </div>
      </div>

      <div className="form-box">
        <h2>Create New Post</h2>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>LinkedIn</option>
          <option>Instagram</option>
          <option>Twitter</option>
          <option>Facebook</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Draft</option>
          <option>Published</option>
        </select>

        <button onClick={handleAddPost}>Add Post</button>
      </div>

      <div className="posts">
        <h2>Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <b>Platform:</b> {post.platform}
              </p>
              <p>
                <b>Status:</b> {post.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;