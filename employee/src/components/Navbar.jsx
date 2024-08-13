import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ username }) => {
  return (
    <nav className="bg-custNav p-4 sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/Home" className="text-white font-semibold hover:text-gray-400">Home</Link>
          <Link to="/employee-list" className="text-white font-semibold hover:text-gray-400">Employee List</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {/* <span className="text-white">{username}</span> */}
          <span className="text-white">Hukum-Gupta</span>
          <Link to="/" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
