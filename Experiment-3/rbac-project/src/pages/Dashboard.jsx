import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout, hasPermission } = useAuth();

  const [items, setItems] = useState([
    {
      id: 1,
      title: "RBAC Authentication",
      description:
        "Role-based authentication and authorization system.",
    },
    {
      id: 2,
      title: "User Management",
      description:
        "Manage users according to their assigned roles.",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const openCreateForm = () => {
    setEditingItem(null);

    setFormData({
      title: "",
      description: "",
    });

    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setFormData({
      title: item.title,
      description: item.description,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);

    setEditingItem(null);

    setFormData({
      title: "",
      description: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || !description) {
      return;
    }

    if (editingItem) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title,
                description,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        title,
        description,
      };

      setItems((previous) => [
        ...previous,
        newItem,
      ]);
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      return;
    }

    setItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div>
            <p className="dashboard-label">
              RBAC SYSTEM
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Welcome back, {user?.name}
            </p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </header>


        {/* ================= PROFILE ================= */}

        <section className="profile-card">

          <div className="profile-avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">

            <h2>{user?.name}</h2>

            <p>{user?.email}</p>

            <span
              className={`role-badge ${
                user?.role?.toLowerCase() || ""
              }`}
            >
              {user?.role}
            </span>

          </div>

        </section>


        {/* ================= PERMISSIONS ================= */}

        <section className="permissions-section">

          <div className="section-heading">

            <div>
              <p className="dashboard-label">
                ACCESS CONTROL
              </p>

              <h2>Your Permissions</h2>

              <p>
                Available actions based on your role.
              </p>
            </div>

          </div>


          <div className="permission-grid">

            {/* READ */}

            <div className="permission-card">

              <div className="permission-top">
                <span className="permission-icon">
                  👁️
                </span>

                <span
                  className={
                    hasPermission("read")
                      ? "status allowed"
                      : "status denied"
                  }
                >
                  {hasPermission("read")
                    ? "Allowed"
                    : "Not Allowed"}
                </span>
              </div>

              <h3>Read</h3>

              <p>
                View available content and
                information.
              </p>

            </div>


            {/* EDIT */}

            <div className="permission-card">

              <div className="permission-top">
                <span className="permission-icon">
                  ✏️
                </span>

                <span
                  className={
                    hasPermission("edit")
                      ? "status allowed"
                      : "status denied"
                  }
                >
                  {hasPermission("edit")
                    ? "Allowed"
                    : "Not Allowed"}
                </span>
              </div>

              <h3>Edit</h3>

              <p>
                Modify existing content.
              </p>

            </div>


            {/* CREATE */}

            <div className="permission-card">

              <div className="permission-top">
                <span className="permission-icon">
                  ➕
                </span>

                <span
                  className={
                    hasPermission("create")
                      ? "status allowed"
                      : "status denied"
                  }
                >
                  {hasPermission("create")
                    ? "Allowed"
                    : "Not Allowed"}
                </span>
              </div>

              <h3>Create</h3>

              <p>
                Create new content in the
                system.
              </p>

            </div>


            {/* DELETE */}

            <div className="permission-card">

              <div className="permission-top">
                <span className="permission-icon">
                  🗑️
                </span>

                <span
                  className={
                    hasPermission("delete")
                      ? "status allowed"
                      : "status denied"
                  }
                >
                  {hasPermission("delete")
                    ? "Allowed"
                    : "Not Allowed"}
                </span>
              </div>

              <h3>Delete</h3>

              <p>
                Remove existing content from
                the system.
              </p>

            </div>

          </div>

        </section>


        {/* ================= CRUD SECTION ================= */}

        <section className="crud-section">

          <div className="crud-header">

            <div>

              <p className="dashboard-label">
                CONTENT MANAGEMENT
              </p>

              <h2>Manage Content</h2>

              <p>
                Create, view, edit and delete
                content according to your role.
              </p>

            </div>


            {hasPermission("create") && (
              <button
                type="button"
                className="create-button"
                onClick={openCreateForm}
              >
                <span className="button-icon">
                  ＋
                </span>

                Create New
              </button>
            )}

          </div>


          {/* CONTENT LIST */}

          <div className="items-list">

            {items.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  📭
                </div>

                <h3>
                  No content available
                </h3>

                <p>
                  Create a new item to get
                  started.
                </p>

                {hasPermission("create") && (
                  <button
                    type="button"
                    className="create-button"
                    onClick={openCreateForm}
                  >
                    ＋ Create First Item
                  </button>
                )}

              </div>

            ) : (

              items.map((item) => (

                <div
                  className="content-item"
                  key={item.id}
                >

                  <div className="content-icon">
                    📄
                  </div>


                  <div className="content-info">

                    <h3>{item.title}</h3>

                    <p>
                      {item.description}
                    </p>

                  </div>


                  <div className="content-actions">

                    {hasPermission("edit") && (
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          openEditForm(item)
                        }
                      >
                        ✏️ Edit
                      </button>
                    )}


                    {hasPermission("delete") && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        🗑️ Delete
                      </button>
                    )}


                    {!hasPermission("edit") &&
                      !hasPermission("delete") && (
                        <span className="read-only">
                          👁️ Read Only
                        </span>
                      )}

                  </div>

                </div>

              ))

            )}

          </div>

        </section>


        {/* ================= ROLE TABLE ================= */}

        <section className="role-info">

          <div className="section-heading">

            <p className="dashboard-label">
              AUTHORIZATION
            </p>

            <h2>
              Role-Based Access Control
            </h2>

            <p>
              Different roles receive different
              levels of access.
            </p>

          </div>


          <div className="role-table">

            <div className="role-row role-header">

              <span>Role</span>

              <span>Permissions</span>

            </div>


            <div className="role-row">

              <span className="role-name admin">
                Admin
              </span>

              <span>
                Create • Read • Edit • Delete
              </span>

            </div>


            <div className="role-row">

              <span className="role-name editor">
                Editor
              </span>

              <span>
                Create • Read • Edit
              </span>

            </div>


            <div className="role-row">

              <span className="role-name viewer">
                Viewer
              </span>

              <span>
                Read
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ================= CREATE / EDIT MODAL ================= */}

      {showForm && (

        <div
          className="modal-overlay"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeForm();
            }
          }}
        >

          <div className="crud-modal">

            <button
              type="button"
              className="modal-close"
              onClick={closeForm}
              aria-label="Close"
            >
              ×
            </button>


            <div className="modal-header">

              <div className="modal-icon">
                {editingItem
                  ? "✏️"
                  : "➕"}
              </div>

              <h2>
                {editingItem
                  ? "Edit Content"
                  : "Create Content"}
              </h2>

              <p>
                {editingItem
                  ? "Update the existing content."
                  : "Add a new item to the system."}
              </p>

            </div>


            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label htmlFor="content-title">
                  Title
                </label>

                <input
                  id="content-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter content title"
                  autoComplete="off"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="content-description">
                  Description
                </label>

                <textarea
                  id="content-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter content description"
                  rows={5}
                  required
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-button"
                >
                  {editingItem
                    ? "Save Changes"
                    : "Create Item"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;