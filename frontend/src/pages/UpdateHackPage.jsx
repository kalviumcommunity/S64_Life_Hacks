import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UpdateHackPage.css"; // Ensure the CSS file exists

const UpdateHackPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState(""); 
  const [error, setError] = useState(""); // Error handling state
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHack = async () => {
      try {
        // Determine the correct API route (MongoDB or PostgreSQL)
        const isMongo = id.startsWith("mongo-");
        const apiURL = isMongo 
          ? `http://localhost:8000/api/mongo/hacks/${id.replace("mongo-", "")}`
          : `http://localhost:8000/api/postgres/hacks/${id.replace("postgres-", "")}`;

        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Failed to fetch hack details");
        
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCreatedBy(isMongo ? `mongo-${data.created_by}` : `postgres-${data.created_by}`);
      } catch (err) {
        setError("Error loading hack details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHack();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    const updatedHack = { title, description, category, created_by: createdBy.replace("mongo-", "").replace("postgres-", "") };
    const isMongo = createdBy.startsWith("mongo-");
    const apiURL = isMongo
      ? `http://localhost:8000/api/mongo/hacks/${id.replace("mongo-", "")}`
      : `http://localhost:8000/api/postgres/hacks/${id.replace("postgres-", "")}`;

    try {
      const response = await fetch(apiURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHack),
      });

      if (response.ok) {
        navigate("/hacks"); // Redirect on success
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update hack.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error updating hack:", error);
    }
  };

  return (
    <div className="update-hack-container">
      <h1 className="update-hack-title">✏️ Update Hack</h1>
      
      {loading ? (
        <p>Loading hack details...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="update-hack-form">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />

          <button type="submit" className="update-hack-button">Update Hack</button>
        </form>
      )}
    </div>
  );
};

export default UpdateHackPage;
