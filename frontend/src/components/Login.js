import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const apiUrl = "http://localhost:8000/auth/login";
  const [values, setValues] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(apiUrl, values)
      .then((result) => {
        if (result.data.loginStatus === true) {
          navigate("/dashboard");
        } else {
          setError(result.data.Error || "An unknown error occurred");
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.Error || "An unknown error occurred";
        setError(errorMessage);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Teacher Portal Login</h3>
              <div className="text-danger" style={{ fontSize: '13px' }}>{error && error}</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 position-relative">
                  <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control ps-5" // Padding-left to make room for icon
                    id="username"
                    placeholder="Enter your username"
                    autoComplete="off"
                    // value={name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control ps-5" // Padding-left to make room for icon
                    id="password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    // value={password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
