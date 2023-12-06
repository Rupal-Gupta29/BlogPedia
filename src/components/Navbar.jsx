import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import style from "../styles/navbar.module.css";
import { NavLink } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSignOut = () => {
    firebase
      .signOutUser()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.log("Error in signing out user", error));
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand>
          <NavLink to={"/home"} className={style.link}>
            BlogPedia
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <div className="m-2">
              <NavLink
                to={"/home"}
                className={(details) => {
                  return details.isActive
                    ? style.link + " " + style.activeLink
                    : style.link;
                }}
              >
                Home
              </NavLink>
            </div>
            <div className="m-2">
              <NavLink
                to={"/createblog"}
                className={(details) => {
                  return details.isActive
                    ? style.link + " " + style.activeLink
                    : style.link;
                }}
              >
                Create Blog
              </NavLink>
            </div>
          </Nav>
          <div className="d-flex align-items-center">
            {firebase.user && (
              <span className="fw-bold me-3">
                Welcome! {firebase.user.displayName}
              </span>
            )}
            <button className="btn btn-outline-warning" onClick={handleSignOut}>
              Logout
            </button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
