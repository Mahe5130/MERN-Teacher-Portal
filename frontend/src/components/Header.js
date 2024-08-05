import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const apiUrl = "http://localhost:8000/auth";

  const handelLogout = () => {
    axios.get(apiUrl + "/logout").then((result) => {
      if (result.data.status) {
        navigate("/");
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#" style={{ color: "red" }}>
          tailwebs.
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="ms-auto navbar-nav">
            <a className="nav-link active" aria-current="page" href="#">
              Home
            </a>
            <a className="nav-link"  href="#" onClick={handelLogout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
