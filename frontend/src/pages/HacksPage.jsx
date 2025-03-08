import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HackCard from "../components/HackCard";
import "../styles/HacksPage.css"; // Import the updated CSS

const HacksPage = () => {
  const [hacks, setHacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/hacks")
      .then((res) => res.json())
      .then((data) => setHacks(data))
      .catch((err) => console.error("Error fetching hacks:", err));
  }, []);

  return (
    <div className="hacks-page w-full h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">🔥 Latest Hacks 🔥</h1>
      <p className="text-center text-gray-600 mt-2">Discover and vote for the craziest life hacks!</p>

      <div className="text-center mt-4">
        <Link to="/add-hack" className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition">
          ➕ Add Hack
        </Link>
      </div>

      <div className="max-w-5xl mx-auto mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {hacks.length > 0 ? (
          hacks.map((hack) => <HackCard key={hack._id} {...hack} />)
        ) : (
          <p className="text-center text-gray-600">Loading hacks...</p>
        )}
      </div>
    </div>
  );
};

export default HacksPage;
