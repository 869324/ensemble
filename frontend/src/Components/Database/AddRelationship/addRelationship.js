import styles from "./addRelationship.module.scss";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import swal from "sweetalert";
import { resetModal } from "../../../StateManagement/Reducers/modalReducer";
import {
  getRelationships,
  getTargetColumns,
  tableReset,
  addRelationship,
} from "../../../StateManagement/Reducers/tablesReducer";

function AddRelationship(props) {
  const dispatch = useDispatch();

  const { tables } = useSelector((state) => state.tables.getTables);
  const addRelationState = useSelector((state) => state.tables.addRelationship);
  const getColumnsState = useSelector((state) => state.tables.getTargetColumns);

  const [targetColumns, setTargetColumns] = useState([]);
  const [relationData, setRelationData] = useState({
    tableId: props.tableId,
    sourceColumn:
      props.sourceColumns.length > 0 ? props.sourceColumns[0].columnId : "",
    targetColumn: "",
    referenceTable: "",
  });

  useEffect(() => {
    dispatch(getTargetColumns(relationData.referenceTable));
  }, [relationData.referenceTable]);

  useEffect(() => {
    const { tried, status, columns } = getColumnsState;
    if (tried && status) {
      setTargetColumns(columns);
      if (columns.length > 0) {
        setRelationData((prev) => ({
          ...prev,
          targetColumn: columns[0].columnId,
        }));
      } else {
        setRelationData((prev) => ({ ...prev, targetColumn: "" }));
      }
    }
  }, [getColumnsState]);

  useEffect(() => {
    const { loading, error, status, tried } = addRelationState;

    if (tried) {
      if (status) {
        dispatch(getRelationships(props.tableId));
        swal({
          title: "Relationship has been created",
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
  }, [addRelationState]);

  useEffect(() => {
    return () => {
      dispatch(tableReset("addRelationship"));
      dispatch(tableReset("getColumns"));
    };
  }, []);

  function changeRelation(e) {
    console.log(e.target.name);
    setRelationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(relationData);
  }

  function submit(e) {
    e.preventDefault();
    console.log(relationData);
    if (relationData.column1 == "" || relationData.column2 == "") {
      swal({
        icon: "warning",
        title: "Incomplete data",
        text: "Fill in all fields",
      });
    } else {
      dispatch(addRelationship(relationData));
    }
  }

  return (
    <div className={styles.main}>
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.rSelect}>
          <div className={styles.header}>
            <h5>Column (Foreign Key)</h5>
            <h5>Reference (Table)</h5>
            <h5>Reference (Column)</h5>
          </div>

          <div className={styles.selectDiv}>
            <select
              className={styles.select}
              name="sourceColumn"
              onChange={changeRelation}
            >
              {props.sourceColumns.map((column) => {
                return <option value={column.columnId}>{column.name}</option>;
              })}
            </select>

            <select
              className={styles.select}
              name="referenceTable"
              onChange={changeRelation}
            >
              {tables.map((table) => {
                if (table.tableId != props.tableId) {
                  return <option value={table.tableId}>{table.name}</option>;
                }
              })}
            </select>

            <select
              className={styles.select}
              name="targetColumn"
              onChange={changeRelation}
            >
              {targetColumns.map((column) => {
                return <option value={column.columnId}>{column.name}</option>;
              })}
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>
    </div>
  );
}

export default AddRelationship;
