import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddHackPage.css"; // Add this line

const AddHackPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newHack = { title, description, category };

    try {
      const response = await fetch("http://localhost:8000/api/hacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHack),
      });
      
      if (response.ok) {
        navigate("/hacks"); // Redirect to the Hacks page
      } else {
        console.error("Failed to add hack");
      }
    } catch (error) {
      console.error("Error submitting hack:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="submit-text">🛠 Submit a Hack</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2 font-semibold">Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-4" required />
        
        <label className="block mb-2 font-semibold">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-4" required />
        
        <label className="block mb-2 font-semibold">Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded mb-4" required />
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default AddHackPage;
