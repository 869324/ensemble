import styles from "./home.module.scss";

import Header from "../../Components/Header/header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Search from "../../Components/Search/search";
import { FaUpload } from "react-icons/fa";
import { MdDelete, MdLocationOn } from "react-icons/md";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { debounce } from "lodash";
import {
  getProjects,
  resetProjects,
} from "../../StateManagement/Reducers/projectsReducer";
import Sort from "../../Components/Sort/sort";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProjectsState = useSelector((state) => state.projects);

  const [projectsData, setProjectsData] = useState({
    order: "NAME_ASC",
    name: null,
    size: 10,
    page: 1,
    projectId: null,
  });

  useEffect(() => {
    dispatch(getProjects(projectsData));
  }, []);

  useEffect(() => {
    const { tried, error, loading, status, projects } = getProjectsState;

    if (tried && !status && !loading) {
      swal({
        icon: "error",
        text: "Problem getting projects. Try again later",
      });
    }
  }, [getProjectsState]);

  useEffect(() => {
    return () => {
      dispatch(resetProjects());
    };
  }, []);

  function chooseProject() {}

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  function handleChange(e) {
    setProjectsData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url("/assets/logos/default.jpeg")` }}
    >
      <div className={styles.overlay}>
        <Header />

        <div className={styles.body}>
          <div className={styles.projectChooser}>
            <h2 className={styles.h2}>Projects</h2>

            <div className={styles.actions}>
              <Search
                data={projectsData}
                method={getProjects}
                debouncedSearch={debouncedSearch}
              />

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

            <table className={styles.table}>
              <thead>
                <tr className={styles.rowHeader}>
                  <th>No.</th>
                  <th>Name.</th>
                  <th>Team</th>
                  <th>Budget</th>
                  <th>Progress</th>
                </tr>
              </thead>

              <tbody>
                {getProjectsState.projects.map((project, id) => {
                  return (
                    <tr key={id} className={styles.rowData}>
                      <td>{id + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.team}</td>
                      <td>{project.budget}</td>
                      <td>{project.progress}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
