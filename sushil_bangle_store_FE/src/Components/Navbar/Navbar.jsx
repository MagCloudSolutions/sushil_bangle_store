import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { successToast } from "../../Utils/Toast";
import { ToastContainer } from "react-toastify";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const isConfirmed = window.confirm("Logout?");

    if (isConfirmed) {
      if (localStorage.getItem("token")) localStorage.removeItem("token");

      if (localStorage.getItem("isAdmin")) localStorage.removeItem("isAdmin");

      successToast("Logout Successfully");
      navigate("/login");
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar bg-[#670006] navbar-expand-lg sticky-top top-0">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Sushil Bangle Store
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/inventory">
                  Your Inventory
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  Order History
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/billing">
                  Billing
                </Link>
              </li>

              {(localStorage.getItem("token") || localStorage.getItem("isAdmin")) ? (
                <li className="nav-item">
                  <button className="btn btn-sm mx-1" onClick={handleLogout}>
                    <Link className="nav-link">
                      <span>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      </span>
                      Logout
                    </Link>
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <button className="btn btn-sm mx-1">
                      <Link className="nav-link" to="/login">
                        <span>
                          <i className="fa-solid fa-right-to-bracket"></i>
                        </span>
                        Login
                      </Link>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-sm mx-1">
                      <Link className="nav-link" to="/signup">
                        <span>
                          <i className="fa-solid fa-user-plus"></i>
                        </span>
                        Signup
                      </Link>
                    </button>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;