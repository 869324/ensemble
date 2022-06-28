//import "./home.scss";

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Workbench from "../Workbench/workbench";
import Home from "../Home/home";
import { useSelector } from "react-redux";
import { RootState } from "../../StateManagement/Store/store";
import { useEffect } from "react";

function User() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />}></Route>
      <Route path="home" element={<Home />}></Route>
      <Route path="workbench" element={<Workbench />}></Route>
    </Routes>
  );
}

export default User;
