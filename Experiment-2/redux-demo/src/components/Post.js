import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  deletePost,
  updatePost,
} from "../features/posts/postSlice";

function Post() {
  const posts = useSelector((state) => state.posts.items);
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = () => {
    if (text.trim() === "") return;

    if (editId === null) {
      dispatch(
        addPost({
          id: Date.now(),
          content: text,
        })
      );
    } else {
      dispatch(
        updatePost({
          id: editId,
          content: text,
        })
      );
      setEditId(null);
    }

    setText("");
  };

  const handleEdit = (post) => {
    setText(post.content);
    setEditId(post.id);
  };

  return (
    <div className="page">
      <div className="container">

        <div className="header">
          <div>
            <h1>📝 Redux Post Manager</h1>
            <p>Manage your posts using Redux Toolkit</p>
          </div>

          <div className="counter-card">
            <span>Total Posts</span>
            <h2>{posts.length}</h2>
          </div>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Write your post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={handleSubmit}
          >
            {editId === null ? "Add Post" : "Update Post"}
          </button>
        </div>

        <div className="posts">

          {posts.length === 0 ? (

            <div className="empty-card">
              <h2>No Posts Available</h2>
              <p>Add your first post.</p>
            </div>

          ) : (

            posts.map((post) => (

              <div className="card" key={post.id}>

                <div className="card-left">

                  <div className="icon">
                    📝
                  </div>

                  <div>

                    <h3>{post.content}</h3>

                    <small>
                      Redux Toolkit Demo
                    </small>

                  </div>

                </div>

                <div className="actions">

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(post)}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      dispatch(deletePost(post.id))
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </div>
  );
}

export default Post;