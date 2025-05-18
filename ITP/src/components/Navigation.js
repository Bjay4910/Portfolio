import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Intelligent Travel Planner</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plan">Plan Trip</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-trips">My Trips</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/documentation">Documentation</Link>
            </li>
          </ul>
          <div className="d-flex">
            {currentUser ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">Hello, {currentUser.name}</span>
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div>
                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-light" to="/signup">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;