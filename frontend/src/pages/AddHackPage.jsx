import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddHackPage.css"; // Ensure this CSS exists

const AddHackPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [users, setUsers] = useState([]); // Store users from API
  const [selectedUser, setSelectedUser] = useState(""); // Track selected user
  const [error, setError] = useState(""); // Store API errors
  const navigate = useNavigate();

  // Fetch users from both MongoDB and PostgreSQL
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [mongoResponse, postgresResponse] = await Promise.all([
          fetch("http://localhost:8000/api/mongo/users"),
          fetch("http://localhost:8000/api/postgres/users"),
        ]);

        const [mongoUsers, postgresUsers] = await Promise.all([
          mongoResponse.json(),
          postgresResponse.json(),
        ]);

        const allUsers = [
          ...mongoUsers.map((user) => ({
            id: user._id?.toString(), // Convert MongoDB ObjectId to string
            name: user.name,
            email: user.email,
            source: "MongoDB",
          })),
          ...postgresUsers.map((user) => ({
            id: user.id?.toString(), // Ensure consistency
            name: user.name,
            email: user.email,
            source: "PostgreSQL",
          })),
        ];

        setUsers(allUsers);
      } catch (err) {
        setError("Error fetching users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Find selected user details
    const selectedUserObj = users.find((user) => user.id === selectedUser);
    if (!selectedUserObj) {
      setError("Invalid user selection.");
      return;
    }

    const dbSource = selectedUserObj.source; // MongoDB or PostgreSQL
    const apiUrl =
      dbSource === "MongoDB"
        ? "http://localhost:8000/api/mongo/hacks"
        : "http://localhost:8000/api/postgres/hacks";

    const newHack = {
      title,
      description,
      category,
      created_by: selectedUserObj.id,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHack),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/hacks");
      } else {
        setError(data.error || "Failed to add hack. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="submit-text">🛠 Submit a Hack</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error messages */}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 font-semibold">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 font-semibold">Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        {/* User selection dropdown */}
        <label className="block mb-2 font-semibold">Select User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        >
          <option value="">Choose a User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email}) - {user.source}
            </option>
          ))}
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddHackPage;
