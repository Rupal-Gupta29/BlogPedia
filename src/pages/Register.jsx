import React, { useState } from "react";
import style from "../styles/loginnregister.module.css";
import { NavLink } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSignup = () => {
    firebase
      .signUpUser(email, password)
      .then((userCredential) => {
        firebase.updateUserProfile(displayName).then(()=>{
          toast.success('Registered Successfully!', {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
          navigate("/login");
        })
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
        <h4>Register</h4>
        <div className={style.controlsWrapper}>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
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
          <button className={style.btn} onClick={handleSignup}>
            Sign Up
          </button>
          {error && <small className={style.errorText}>Error: {error}</small>}
        </div>
        <p className="mt-2">
          <small>
            Already have an account? <NavLink to="/login">Login</NavLink>
          </small>
        </p>
      </div>
    </div>
  );
};

export default Register;
