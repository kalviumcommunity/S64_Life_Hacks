import React from "react";
import HackCard from "../components/HackCard";

const dummyHacks = [
  {
    title: "Dry Clothes Faster with a Fan",
    description: "Put your wet clothes in front of a table fan for quick drying!",
    votes: 42,
  },
  {
    title: "Use Toothpaste to Clean Sneakers",
    description: "Apply toothpaste on dirty sneakers and scrub for a quick clean!",
    votes: 30,
  },
  {
    title: "Chill Drinks Quickly with Wet Paper Towels",
    description: "Wrap a drink in a wet paper towel and put it in the freezer for 10 mins!",
    votes: 58,
  },
];

const HacksPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">🔥 Latest Hacks 🔥</h1>
      <p className="text-center text-gray-600 mt-2">Discover and vote for the craziest life hacks!</p>

      <div className="max-w-5xl mx-auto mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {dummyHacks.map((hack, index) => (
          <HackCard key={index} {...hack} />
        ))}
      </div>
    </div>
  );
};

export default HacksPage;
