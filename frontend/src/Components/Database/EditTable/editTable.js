import { useEffect, useState } from "react";
import styles from "./editTable.module.scss";

import {
  updateTable,
  tableReset,
  getTables,
  selectTable,
} from "../../../StateManagement/Reducers/tablesReducer";

import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function EditTable(props) {
  const dispatch = useDispatch();

  const updateState = useSelector((state) => state.tables.updateTable);

  const [tableData, setTableData] = useState({
    tableId: props.tableId,
    name: props.name,
    description: props.description,
    project: props.project,
  });

  useEffect(() => {
    const { loading, error, status, tried } = updateState;

    if (tried) {
      if (status) {
        dispatch(
          selectTable({
            name: tableData.name,
            description: tableData.description,
          })
        );
        swal({
          title: "Table has been updated",
          icon: "success",
        });
        dispatch(resetModal());
      } else if (loading) {
        swal({
          text: "Loading ...",
        });
      } else if (error !== "") {
        swal({
          title: "Operation failed",
          icon: "error",
          text: error ? error : "Try again later",
        });
      }
    }
  }, [updateState]);

  useEffect(() => {
    return () => {
      dispatch(getTables(props.tablesData));
      dispatch(tableReset("updateTable"));
    };
  }, []);

  function handleTableChange(e) {
    setTableData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    dispatch(updateTable(tableData));
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.tableData}>
          <div className={styles.inputDiv}>
            <label className={styles.label}>Table Name</label>
            <input
              className={styles.input}
              name="name"
              value={tableData.name}
              onChange={handleTableChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.input}
              name="description"
              value={tableData.description}
              onChange={handleTableChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>
    </div>
  );
}

export default EditTable;
