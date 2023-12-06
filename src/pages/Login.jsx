import React, { useState } from "react";
import style from "../styles/loginnregister.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSignIn = () => {
    firebase
      .signInUser(email, password)
      .then((userCredential) => {
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
  };

  return (
    <div className={style.formContainer}>
      <div className={style.formWrapper}>
        <h3>BlogPedia</h3>
        <h4>Login</h4>
        <div className={style.controlsWrapper}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={style.btn} onClick={handleSignIn}>
            Sign In
          </button>
          {error && <small className={style.errorText}>Error: {error}</small>}
        </div>
        <p className="mt-2">
          <small>
            Do not have an account? <NavLink to="/">Register</NavLink>
          </small>
        </p>
      </div>
    </div>
  );
};

export default Login;
