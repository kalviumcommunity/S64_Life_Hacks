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

  // Fetch users for dropdown
  useEffect(() => {
    fetch("http://localhost:8000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError("Error fetching users. Please try again later."));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    const newHack = { title, description, category, created_by: selectedUser };

    try {
      const response = await fetch("http://localhost:8000/api/hacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHack),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/hacks"); // Redirect to the Hacks page
      } else {
        setError(data.error || "Failed to add hack. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error submitting hack:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="submit-text">🛠 Submit a Hack</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error messages */}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-4" required />

        <label className="block mb-2 font-semibold">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-4" required />

        <label className="block mb-2 font-semibold">Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded mb-4" required />

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
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
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