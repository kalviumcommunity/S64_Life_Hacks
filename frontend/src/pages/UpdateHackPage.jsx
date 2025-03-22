import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UpdateHackPage.css"; // Import the CSS file

const UpdateHackPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState(""); // Store created_by user ID
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/hacks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setCreatedBy(data.created_by); // Set created_by from API response
      })
      .catch((err) => console.error("Error fetching hack:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure created_by is included
    const updatedHack = { title, description, category, created_by: createdBy };

    try {
      const response = await fetch(`http://localhost:8000/api/hacks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHack),
      });

      if (response.ok) {
        navigate("/hacks");
      } else {
        const errorData = await response.json();
        console.error("Failed to update hack:", errorData);
      }
    } catch (error) {
      console.error("Error updating hack:", error);
    }
  };

  return (
    <div className="update-hack-container">
      <h1 className="update-hack-title">✏️ Update Hack</h1>
      <form onSubmit={handleSubmit} className="update-hack-form">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <button type="submit" className="update-hack-button">
          Update Hack
        </button>
      </form>
    </div>
  );
};

export default UpdateHackPage;
