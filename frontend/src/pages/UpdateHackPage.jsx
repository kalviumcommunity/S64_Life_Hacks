import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UpdateHackPage.css"; // Keep your provided CSS

const UpdateHackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Invalid hack ID. Please try again.");
      setLoading(false);
      return;
    }

    const isMongo = id.startsWith("mongo-");
    const hackID = id.replace(/^(mongo-|postgres-)/, "");
    const apiURL = `http://localhost:8000/api/${isMongo ? "mongo" : "postgres"}/hacks/${hackID}`;

    console.log("Fetching hack from:", apiURL); // Debugging log

    fetch(apiURL)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data || !data.title) {
          throw new Error("Hack data is missing or invalid.");
        }
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCreatedBy(data.created_by);
      })
      .catch((err) => {
        console.error("Error fetching hack details:", err);
        setError("Error loading hack details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isMongo = id.startsWith("mongo-");
    const hackID = id.replace(/^(mongo-|postgres-)/, "");
    const apiURL = `http://localhost:8000/api/${isMongo ? "mongo" : "postgres"}/hacks/${hackID}`;

    const updatedHack = { title, description, category, created_by: createdBy };

    console.log("Updating hack at:", apiURL, "with data:", updatedHack);

    try {
      const response = await fetch(apiURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHack),
      });

      if (response.ok) {
        console.log("Hack updated successfully!");
        navigate("/hacks");
      } else {
        const errorText = await response.text();
        console.error("Failed to update hack:", errorText);
        setError(`Failed to update hack: ${errorText}`);
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
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

          <label>Created By (User ID):</label>
          <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />

          <button type="submit" className="update-hack-button">Update Hack</button>
        </form>
      )}
    </div>
  );
};

export default UpdateHackPage;
