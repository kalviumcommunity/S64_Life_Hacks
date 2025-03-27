import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HackCard from "../components/HackCard";
import "../styles/HacksPage.css";

const HacksPage = () => {
  const [hacks, setHacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHacks();
  }, [selectedUser]);

  const fetchHacks = async () => {
    setLoading(true);
    setError("");
    try {
      const [mongoResponse, postgresResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/mongo/hacks`),
        fetch(`http://localhost:8000/api/postgres/hacks`),
      ]);

      const [mongoData, postgresData] = await Promise.all([
        mongoResponse.json(),
        postgresResponse.json(),
      ]);

      let combinedHacks = [
        ...mongoData.map((hack) => ({
          ...hack,
          id: hack._id?.toString(), // Ensure ID is a string
          created_by: hack.created_by?.toString(), // Convert to string for filtering
          source: "MongoDB",
        })),
        ...postgresData.map((hack) => ({
          ...hack,
          id: hack.id?.toString(), // Ensure ID consistency
          created_by: hack.created_by?.toString(), // Ensure consistency
          source: "PostgreSQL",
        })),
      ];

      console.log("Fetched Hacks:", combinedHacks);
      console.log("Selected User ID:", selectedUser);

      // Apply filtering if a user is selected
      if (selectedUser) {
        combinedHacks = combinedHacks.filter((hack) => hack.created_by === selectedUser);
      }

      setHacks(combinedHacks);
    } catch (err) {
      setError("Error fetching hacks. Please check your connection.");
      console.error("Error fetching hacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

      console.log("Fetched Users:", allUsers);
      setUsers(allUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error fetching users. Please try again.");
    }
  };

  const handleDelete = async (id, source) => {
    try {
      const apiUrl =
        source === "MongoDB"
          ? `http://localhost:8000/api/mongo/hacks/${id}`
          : `http://localhost:8000/api/postgres/hacks/${id}`;

      const response = await fetch(apiUrl, { method: "DELETE" });

      if (response.ok) {
        setHacks((prevHacks) => prevHacks.filter((hack) => hack.id !== id));
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

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {/* User Filter Dropdown */}
      <div className="select-container mt-4">
        <label className="font-semibold">Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="dropdown ml-2"
          required
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Add Hack Button */}
      <div className="text-center mt-4">
        <Link
          to="/add-hack"
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition"
        >
          ➕ Add Hack
        </Link>
      </div>

      {loading && <p className="text-center text-gray-600 mt-4">Loading hacks...</p>}

      {/* Display Hacks */}
      <div className="max-w-5xl mx-auto mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {!loading && hacks.length > 0 ? (
          hacks.map((hack) => (
            <HackCard key={hack.id} {...hack} onDelete={() => handleDelete(hack.id, hack.source)} />
          ))
        ) : (
          !loading && <p className="text-center text-gray-600">No hacks available.</p>
        )}
      </div>
    </div>
  );
};

export default HacksPage;
