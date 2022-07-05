import styles from "./database.module.scss";

import { AiOutlineSearch } from "react-icons/ai";
import { RiAddFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { getTables } from "../../StateManagement/Reducers/tablesReducer";
import { debounce } from "lodash";
import Modal from "../../Components/Modal/modal";
import AddTable from "../../Components/AddTable/addTable";
import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";

function Tables() {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const { currentProject } = useSelector((state) => state.projects);
  const tablesState = useSelector((state) => state.tables);

  const [tablesData, setTablesData] = useState({
    project: currentProject,
    name: null,
    tableId: null,
    page: 1,
    size: 10,
    order: "NAME_ASC",
  });

  useEffect(() => {
    dispatch(getTables(tablesData));
  }, [tablesData]);

  useEffect(() => {
    return () => {
      dispatch(resetModal());
    };
  }, []);

  function handleChange(e) {
    setTablesData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const debouncedSearch = debounce(async (e) => {
    handleChange(e);
  }, 300);

  return (
    <div className={styles.panelView}>
      {modalState.showModal && (
        <Modal heading={"Add Table"}>
          <AddTable currentProject={currentProject} />
        </Modal>
      )}
      <h2 className={styles.h2}>Tables</h2>

      <div className={styles.body}>
        <div className={styles.data}>
          <div className={styles.actions}>
            <input
              className={styles.search}
              name="search"
              placeholder="Search..."
              onChange={debouncedSearch}
            />

            <RiAddFill
              className={styles.addIcon}
              size={28}
              onClick={() => {
                dispatch(showModal(true));
              }}
            />
          </div>

          <div className={styles.rows}>
            {tablesState.tables.map((table, id) => {
              return (
                <div key={id} className={styles.tableDiv}>
                  {table.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.content}></div>
      </div>
    </div>
  );
}

export default Tables;
