import "./App.module.scss";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import User from "./Components/User/user";
import Login from "./Views/Login/login";

function App() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="user" />} />
      <Route path="user/*" element={<User />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
