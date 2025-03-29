import { Link } from "react-router-dom";

const HackCard = ({ _id, title, description, votes = 0, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 line-clamp-3">{description}</p>
      <p className="mt-2 text-sm font-semibold">Votes: {votes}</p>
      <div className="flex gap-2 mt-4">
        <Link
          to={`/update-hack/${_id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => onDelete(_id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
          aria-label="Delete hack"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default HackCard;
