import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HackCard from "../components/HackCard";
import "../styles/HacksPage.css"; // Ensure CSS exists

const HacksPage = () => {
  const [hacks, setHacks] = useState([]);
  const [users, setUsers] = useState([]); // Store users from API
  const [selectedUser, setSelectedUser] = useState(""); // Track selected user
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Store errors

  // Fetch hacks from API (filtered by user if selected)
  useEffect(() => {
    fetchHacks();
  }, [selectedUser]);

  const fetchHacks = async () => {
    setLoading(true);
    setError(""); // Reset errors

    const url = selectedUser ? `http://localhost:8000/api/hacks?created_by=${selectedUser}` : "http://localhost:8000/api/hacks";
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setHacks(data);
      } else {
        setError("Failed to load hacks. Please try again.");
      }
    } catch (err) {
      setError("Error fetching hacks. Please check your connection.");
      console.error("Error fetching hacks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setError("Failed to load users.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again.");
    }
  };

  // Handle deletion of hacks
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/hacks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHacks((prevHacks) => prevHacks.filter((hack) => hack._id !== id));
      } else {
        setError("Failed to delete hack.");
      }
    } catch (error) {
      console.error("Error deleting hack:", error);
      setError("An error occurred while deleting the hack.");
    }
  };

  return (
    <div className="hacks-page w-full h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">🔥 Latest Hacks 🔥</h1>
      <p className="text-center text-gray-600 mt-2">Discover and vote for the craziest life hacks!</p>

      {/* Error Message */}
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* User filter dropdown */}
      <div className="select-container mt-4">
        <label className="font-semibold">Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="dropdown ml-2" // Updated to include the new class
          required
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mt-4">
        <Link to="/add-hack" className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition">
          ➕ Add Hack
        </Link>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600 mt-4">Loading hacks...</p>}

      <div className="max-w-5xl mx-auto mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {!loading && hacks.length > 0 ? (
          hacks.map((hack) => (
            <HackCard key={hack._id} {...hack} onDelete={handleDelete} />
          ))
        ) : (
          !loading && <p className="text-center text-gray-600">No hacks available.</p>
        )}
      </div>
    </div>
  );
};

export default HacksPage;