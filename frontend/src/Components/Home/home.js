import styles from "./home.module.scss";

import Header from "../Header/header";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}>
      <Header />

      <div className="home">
        <label id="label">In what team are we working in today?</label>

        <div className="teamsContainer">
          <div
            className="team"
            onClick={() => {
              navigate("/user/workbench");
            }}
          >
            <label className="nameLabel">Team 1</label>
            <label className="projectsLabel">1 Project</label>
          </div>

          <div
            className="team"
            onClick={() => {
              navigate("/user/workbench");
            }}
          >
            <label className="nameLabel">Team 2</label>
            <label className="projectsLabel">3 Projects</label>
          </div>

          <div
            className="team"
            onClick={() => {
              navigate("/user/workbench");
            }}
          >
            <label className="nameLabel">Team 3</label>
            <label className="projectsLabel">5 Project</label>
          </div>
        </div>

        <button>Create Team</button>
      </div>
    </main>
  );
}

export default Home;
