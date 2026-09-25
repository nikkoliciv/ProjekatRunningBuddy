import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-green-600 p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <h2 className="text-white text-3xl font-bold flex items-center space-x-2">
          
          <Link to="/" className="text-white"><span className="material-symbols-outlined">sprint</span>Running Buddy</Link>
        </h2>
      </div>
    </header>
  );
};

export default Navbar;
