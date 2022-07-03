import styles from "./workbench.module.scss";

import Header from "../../Components/Header/header";
import UserDashboard from "../../Components/UserDashboard/userDashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import ProjectOverview from "../ProjectOverview/projectOverview";
import Database from "../Database/database";

function Workbench() {
  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <Header />

        <div className={styles.body}>
          <UserDashboard />

          <div className={styles.panel}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="projectOverview" />}
              ></Route>
              <Route
                path="projectOverview"
                element={<ProjectOverview />}
              ></Route>
              <Route path="database" element={<Database />}></Route>
              <Route path="projectOverview"></Route>
              <Route path="projectOverview"></Route>
              <Route path="projectOverview"></Route>
              <Route path="projectOverview"></Route>
            </Routes>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Workbench;
