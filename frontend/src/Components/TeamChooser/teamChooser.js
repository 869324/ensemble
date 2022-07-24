import styles from "./teamChooser.module.scss";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "../../Components/Search/search";
import { useDispatch, useSelector } from "react-redux";
import Sort from "../../Components/Sort/sort";
import { debounce } from "lodash";
import {
  getTeams,
  teamReset,
} from "../../StateManagement/Reducers/teamsReducer";

function TeamChooser(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getTeamsState = useSelector((state) => state.teams.getTeams);
  const { user } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  const [teamsData, setTeamsData] = useState({
    order: "NAME_ASC",
    name: null,
    size: 10,
    page: 1,
    userId: user.userId,
  });

  useEffect(() => {
    dispatch(getTeams(teamsData, "user"));
  }, [teamsData]);

  useEffect(() => {
    return () => {
      dispatch(teamReset("getTeams"));
    };
  }, []);

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  function handleChange(e) {
    setTeamsData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className={styles.teamChooser}>
      <div className={styles.actions}>
        <Search
          data={teamsData}
          method={getTeams}
          debouncedSearch={debouncedSearch}
        />

        <h2 className={styles.h2}>My Teams</h2>

        <Sort
          handleChange={handleChange}
          options={["NAME_ASC", "NAME_DESC", "SIZE_ASC", "SIZE_DESC"]}
        />
      </div>

      {getTeamsState.teams.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr className={styles.rowHeader}>
              <th>No</th>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>

          <tbody>
            {getTeamsState.teams.map((team, id) => {
              return (
                <tr key={id} className={styles.rowData}>
                  <td>{id + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.teamSize}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {getTeamsState.teams.length == 0 && (
        <h3
          style={{
            color: "whitesmoke",

            textAlign: "center",
          }}
        >
          No teams available
        </h3>
      )}
    </div>
  );
}

export default TeamChooser;
