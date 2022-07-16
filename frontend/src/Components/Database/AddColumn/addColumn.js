import { useEffect, useState } from "react";
import styles from "./addColumn.module.scss";

import {
  getTables,
  tableReset,
  getColumns,
  addColumn,
} from "../../../StateManagement/Reducers/tablesReducer";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";

function AddColumn(props) {
  const dispatch = useDispatch();

  const tableState = useSelector((state) => state.tables.addColumn);

  const [columnData, setColumnData] = useState({
    name: "",
    description: "",
    dataType: "",
    owner: props.tableId,
  });

  useEffect(() => {
    const { loading, error, status, tried } = tableState;

    if (tried) {
      if (status) {
        dispatch(getTables(props.tablesData));
        swal({
          title: "Column has been created",
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
  }, [tableState]);

  useEffect(() => {
    return () => {
      dispatch(getColumns(props.tableId));
      dispatch(tableReset("addColumn"));
    };
  }, []);

  function changeColumn(e) {
    setColumnData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    dispatch(addColumn(columnData));
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.selectionData}>
          <div className={styles.colSelect}>
            <div className={styles.header}>
              <h5>Name</h5>
              <h5>Description</h5>
              <h5>Data type</h5>
            </div>

            <div className={styles.header}>
              <input
                className={styles.dataInput}
                name="name"
                placeholder="Name"
                onChange={changeColumn}
              />
              <input
                className={styles.dataInput}
                name="description"
                placeholder="Description"
                onChange={changeColumn}
              />
              <input
                className={styles.dataInput}
                name="dataType"
                placeholder="Data type"
                onChange={changeColumn}
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Add
        </button>
      </form>
    </div>
  );
}

export default AddColumn;
