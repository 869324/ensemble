import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.scss";
import User from "./Components/User/user";
import Login from "./Views/Login/login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="user" />} />
      <Route path="user/*" element={<User />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
