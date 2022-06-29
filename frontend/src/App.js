import "./App.module.scss";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import User from "./Views/User/user";
import Login from "./Views/Login/login";
import Signup from "./Views/Signup/signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="user" />} />
      <Route path="/user/*" element={<User />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
