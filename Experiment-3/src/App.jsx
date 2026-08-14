import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome Post",
      content: "This is the first post.",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // EDIT STATES
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // =========================
  // LOGIN + JWT
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Store REAL JWT in localStorage
      localStorage.setItem("token", data.token);

      console.log("JWT Token:", data.token);

      setIsLoggedIn(true);

      // Validate JWT using protected API
      fetchProtectedPosts(data.token);

    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend server");
    }
  };

  // =========================
  // PROTECTED API
  // =========================

  const fetchProtectedPosts = async (jwtToken) => {
    try {
      const response = await fetch("http://localhost:5001/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      console.log("Protected API Response:", data);

    } catch (error) {
      console.error("Protected API Error:", error);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setUsername("");
    setPassword("");

    setEditingId(null);
  };

  // =========================
  // CREATE POST
  // =========================

  const handleCreatePost = () => {
    if (!newTitle || !newContent) {
      alert("Please enter title and content");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
    };

    setPosts([...posts, newPost]);

    setNewTitle("");
    setNewContent("");
  };

  // =========================
  // START EDIT
  // =========================

  const handleEdit = (post) => {
    setEditingId(post.id);

    setEditTitle(post.title);
    setEditContent(post.content);
  };

  // =========================
  // SAVE EDIT
  // =========================

  const handleSaveEdit = (id) => {
    if (!editTitle || !editContent) {
      alert("Please enter title and content");
      return;
    }

    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            title: editTitle,
            content: editContent,
          }
        : post
    );

    setPosts(updatedPosts);

    setEditingId(null);

    setEditTitle("");
    setEditContent("");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditTitle("");
    setEditContent("");
  };

  // =========================
  // DELETE POST
  // =========================

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  // =========================
  // LOGIN PAGE
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <h1>JWT Authentication</h1>

          <p className="subtitle">
            Role-Based Login System
          </p>

          <form onSubmit={handleLogin}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >

              <option value="Admin">
                Admin
              </option>

              <option value="Editor">
                Editor
              </option>

              <option value="Viewer">
                Viewer
              </option>

            </select>

            <button type="submit">
              Login
            </button>

          </form>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE 2 - POSTS DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>
            Posts Dashboard
          </h1>

          <p>
            Welcome <strong>{username}</strong>
          </p>

          <p>
            Role: <strong>{role}</strong>
          </p>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* CREATE POST */}

      {(role === "Admin" || role === "Editor") && (

        <div className="create-post">

          <h2>
            Create Post
          </h2>

          <input
            type="text"
            placeholder="Post title"
            value={newTitle}
            onChange={(e) =>
              setNewTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Post content"
            value={newContent}
            onChange={(e) =>
              setNewContent(e.target.value)
            }
          />

          <button onClick={handleCreatePost}>
            Create Post
          </button>

        </div>

      )}

      {/* POSTS */}

      <div className="posts-section">

        <h2>
          All Posts
        </h2>

        {posts.map((post) => (

          <div
            className="post-card"
            key={post.id}
          >

            {/* EDIT MODE */}

            {editingId === post.id ? (

              <div className="edit-form">

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                />

                <button
                  className="save-button"
                  onClick={() =>
                    handleSaveEdit(post.id)
                  }
                >
                  Save Changes
                </button>

                <button
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

              </div>

            ) : (

              /* NORMAL POST */

              <>

                <h3>
                  {post.title}
                </h3>

                <p>
                  {post.content}
                </p>

                <div className="post-actions">

                  {/* ADMIN + EDITOR */}

                  {(role === "Admin" ||
                    role === "Editor") && (

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(post)
                      }
                    >
                      Edit
                    </button>

                  )}

                  {/* ADMIN ONLY */}

                  {role === "Admin" && (

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(post.id)
                      }
                    >
                      Delete
                    </button>

                  )}

                  {/* EDITOR */}

                  {role === "Editor" && (

                    <span className="permission-message">
                      Delete not available
                    </span>

                  )}

                  {/* VIEWER */}

                  {role === "Viewer" && (

                    <span className="permission-message">
                      View only
                    </span>

                  )}

                </div>

              </>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;