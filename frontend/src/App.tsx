import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import User from "./Components/User/user";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="user" />} />
      <Route path="user/*" element={<User />} />
    </Routes>
  );
}

export default App;
