const HackCard = ({ title, description, votes = 0 }) => { 
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="mt-2 text-sm font-semibold">Votes: {votes}</p>
    </div>
  );
};

export default HackCard;
