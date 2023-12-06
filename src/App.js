import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import BlogDetailed from "./pages/BlogDetailed";
import Error from "./pages/Error";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFirebase } from "./context/firebase";
import { Navigate } from "react-router-dom";

const App = () => {
  const firebase = useFirebase();

  const ProtectedRoute = ({ children }) => {
    if (!firebase.isLoggedIn) {
      return <Navigate to="/" />;
    }
    return children;
  };

  console.log('aaa', process.env.REACT_APP_APIKEY)

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createblog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="home/blog/:blogId"
            element={
              <ProtectedRoute>
                <BlogDetailed />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
        <ToastContainer position="bottom-center" />
      </div>
    </>
  );
};

export default App;
