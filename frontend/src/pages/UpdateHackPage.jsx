import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UpdateHackPage.css";

const UpdateHackPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHack = async () => {
      try {
        const isMongo = id.startsWith("mongo-");
        const hackId = isMongo ? id.replace("mongo-", "") : id.replace("postgres-", "");
        const apiURL = isMongo 
          ? `http://localhost:8000/api/mongo/hacks/${hackId}`
          : `http://localhost:8000/api/postgres/hacks/${hackId}`;

        console.log("📌 Fetching hack from:", apiURL);
        const response = await fetch(apiURL);

        if (!response.ok) {
          throw new Error(`Failed to fetch hack. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Hack data received:", data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCreatedBy(data.created_by?.toString()); // Ensure string format
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Error loading hack details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHack();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isMongo = id.startsWith("mongo-");
    const hackId = id.replace("mongo-", "").replace("postgres-", "");
    const apiURL = isMongo
      ? `http://localhost:8000/api/mongo/hacks/${hackId}`
      : `http://localhost:8000/api/postgres/hacks/${hackId}`;

    const formattedCreatedBy = createdBy.startsWith("postgres-")
      ? Number(createdBy.replace("postgres-", ""))
      : createdBy.replace("mongo-", "");

    const updatedHack = {
      title,
      description,
      category,
      created_by: formattedCreatedBy,
    };

    try {
      console.log("📤 Updating hack at:", apiURL);
      console.log("🔄 Payload being sent:", JSON.stringify(updatedHack));

      const response = await fetch(apiURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHack),
      });

      const responseData = await response.json();
      console.log("🔄 Server response:", responseData);

      if (response.ok) {
        console.log("✅ Hack updated successfully!");
        navigate("/hacks");
      } else {
        setError(responseData.error || "Failed to update hack.");
      }
    } catch (error) {
      console.error("❌ Error updating hack:", error);
      setError("An unexpected error occurred. Please try again.");
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

          <input type="hidden" value={createdBy} />

          <button type="submit" className="update-hack-button">Update Hack</button>
        </form>
      )}
    </div>
  );
};

export default UpdateHackPage;
