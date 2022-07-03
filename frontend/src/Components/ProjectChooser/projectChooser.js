import styles from "./projectChooser.module.scss";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "../../Components/Search/search";
import { useDispatch, useSelector } from "react-redux";
import Sort from "../../Components/Sort/sort";
import { debounce } from "lodash";
import {
  getProjects,
  resetProjects,
  selectProject,
} from "../../StateManagement/Reducers/projectsReducer";

function ProjectChooser(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProjectsState = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.user);

  const [projectsData, setProjectsData] = useState({
    order: "NAME_ASC",
    name: null,
    size: 10,
    page: 1,
    userId: user.userId,
  });

  useEffect(() => {
    dispatch(getProjects(projectsData, "user"));
  }, [projectsData]);

  useEffect(() => {
    return () => {
      dispatch(resetProjects());
    };
  }, []);

  function chooseProject(id) {
    dispatch(selectProject(id));
    navigate("/user/workbench");
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  function handleChange(e) {
    setProjectsData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className={styles.projectChooser}>
      <div className={styles.actions}>
        <Search
          data={projectsData}
          method={getProjects}
          debouncedSearch={debouncedSearch}
        />

        <h2 className={styles.h2}>My Projects</h2>

        <Sort
          handleChange={handleChange}
          options={[
            "NAME_ASC",
            "NAME_DESC",
            "PROGRESS_ASC",
            "PROGRESS_DESC",
            "BUDGET_ASC",
            "BUDGET_DESC",
          ]}
        />
      </div>

      {getProjectsState.projects.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr className={styles.rowHeader}>
              <th>No</th>
              <th>Name</th>
              <th>Team</th>
              <th>Budget</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody>
            {getProjectsState.projects.map((project, id) => {
              return (
                <tr
                  key={id}
                  className={styles.rowData}
                  onClick={() => chooseProject(project.projectId)}
                >
                  <td>{id + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.teamName}</td>
                  <td>{project.budget}</td>
                  <td>{project.progress}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {getProjectsState.projects.length == 0 && (
        <h3
          style={{
            color: "whitesmoke",

            textAlign: "center",
          }}
        >
          No Projects available
        </h3>
      )}
    </div>
  );
}

export default ProjectChooser;
