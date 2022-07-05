import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getColumns,
  resetGetColumns,
} from "../../StateManagement/Reducers/tablesReducer";
import styles from "./table.module.scss";
import swal from "sweetalert";

function Table() {
  const dispatch = useDispatch();

  const { currentTable } = useSelector((state) => state.tables);
  const columnState = useSelector((state) => state.tables.getColumns);

  useEffect(() => {
    dispatch(getColumns(currentTable.tableId));
  }, [currentTable.tableId]);

  useEffect(() => {
    const { tried, status, loading } = columnState;

    if (tried && !status && !loading) {
      swal({
        icon: "error",
        title: "Problem loading columns",
        text: "Try again later",
      });
    }
  }, columnState);

  useEffect(() => {
    return () => {
      dispatch(resetGetColumns());
    };
  }, []);

  if (currentTable) {
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Name:</label>
            <label className={styles.headerValue}>{currentTable.name}</label>
          </div>

          <div className={styles.headerDiv}>
            <label className={styles.headerDesc}>Description:</label>
            <label className={styles.headerValue}>
              {currentTable.description}
            </label>
          </div>

          <div className={styles.headerDiv}>
            <button className={styles.delete}>Delete Table</button>
          </div>
        </div>

        <div className={styles.tablesDiv}>
          <div className={styles.columns}>
            <h4>Columns</h4>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Data type</th>
                </tr>
              </thead>

              <tbody>
                {currentTable.columns.map((column, id) => {
                  return (
                    <tr key={id} className={styles.rowData}>
                      <td>{id + 1}</td>
                      <td>{column.name}</td>
                      <td>{column.description}</td>
                      <td>{column.datatype}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.relationships}>
            <h4>Relationships</h4>

            <table className={styles.table}>
              <thead>
                <th>No.</th>
                <th>Foreign Key</th>
                <th>Reference (Table)</th>
                <th>Column</th>
              </thead>

              <tbody>
                {currentTable.relationships.map((relationship, id) => {
                  return (
                    <tr key={id} className={styles.header}>
                      <td>{id + 1}</td>
                      <td>{relationship.sourceName}</td>
                      <td>{relationship.referenceName}</td>
                      <td>{relationship.columnName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.edit}>Edit Table</button>
          <button className={styles.addRship}>Add Relationship</button>
        </div>
      </div>
    );
  }
}

export default Table;
