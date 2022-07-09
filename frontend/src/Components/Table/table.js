import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getColumns,
  tableReset,
  deleteColumn,
  deleteRelationship,
  deleteTable,
  getTables,
  getRelationships,
  populateTable,
} from "../../StateManagement/Reducers/tablesReducer";
import styles from "./table.module.scss";
import swal from "sweetalert";
import Modal from "../Modal/modal";
import AddTable from "../AddTable/addTable";
import { showModal } from "../../StateManagement/Reducers/modalReducer";
import { MdDelete } from "react-icons/md";
import EditTable from "../EditTable/editTable";
import AddRelationship from "../AddRelationship/addRelationship";
import AddColumn from "../AddColumn/addColumn";

function Table(props) {
  const dispatch = useDispatch();

  const { currentTable } = useSelector((state) => state.tables);
  const columnState = useSelector((state) => state.tables.getColumns);
  const deleteTableState = useSelector((state) => state.tables.deleteTable);
  const deleteColumnState = useSelector((state) => state.tables.deleteColumn);
  const deleteRelationshipState = useSelector(
    (state) => state.tables.deleteRelationship
  );
  const modalState = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(getColumns(currentTable.tableId));
    dispatch(getRelationships(currentTable.tableId));
  }, [currentTable.tableId]);

  useEffect(() => {
    const { tried, status, loading, columns } = columnState;
    if (tried && status) {
      dispatch(
        populateTable({
          columns: columns,
        })
      );
    } else if (tried && !status && !loading) {
      swal({
        icon: "error",
        title: "Problem loading columns",
        text: "Try again later",
      });
    }
  }, [columnState]);

  useEffect(() => {
    const { loading, error, status, tried } = deleteTableState;

    if (tried) {
      if (status) {
        dispatch(getTables(props.tablesData));
        swal({
          title: "Table has been deleted",
          icon: "success",
        });
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
  }, [deleteTableState]);

  useEffect(() => {
    const { loading, error, status, tried } = deleteColumnState;

    if (tried) {
      if (status) {
        dispatch(getColumns(currentTable.tableId));
        swal({
          title: "Column has been deleted",
          icon: "success",
        });
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
  }, [deleteColumnState]);

  useEffect(() => {
    const { loading, error, status, tried } = deleteRelationshipState;

    if (tried) {
      if (status) {
        dispatch(getRelationships(currentTable.tableId));
        swal({
          title: "Relationship has been deleted",
          icon: "success",
        });
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
  }, [deleteRelationshipState]);

  useEffect(() => {
    return () => {
      dispatch(tableReset("getColumns"));
      dispatch(tableReset("deleteColumn"));
      dispatch(tableReset("deleteRelationship"));
      dispatch(tableReset("deleteTable"));
    };
  }, []);

  function handleColumn(action, data) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to delete this column?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(deleteColumn(data));
          }
        });

        break;
      default:
        break;
    }
  }

  function getColName(relationship, status) {
    const id =
      status == "source"
        ? relationship.sourceColumn
        : relationship.targetColumn;
    const col = currentTable.columns.find((column) => column.columnId == id);

    return col ? col.name : relationship.targetName;
  }

  function handleRelationship(action, data) {
    switch (action) {
      case "delete":
        swal({
          icon: "warning",
          title: "Confirm",
          text: `Are you sure you want to delete this relationship?`,
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((isConfirm) => {
          if (isConfirm) {
            dispatch(deleteRelationship(data));
          }
        });

        break;
      default:
        break;
    }
  }

  function handleTable() {
    swal({
      icon: "warning",
      title: "Confirm",
      text: `Are you sure you want to delete this table?`,
      buttons: ["No", "Yes"],
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        dispatch(deleteTable(currentTable.tableId));
      }
    });
  }

  if (currentTable) {
    return (
      <div className={styles.main}>
        {modalState.showModal && modalState.action == "editTable" && (
          <Modal heading={"Edit Table"}>
            <EditTable
              name={currentTable.name}
              project={props.currentProject}
              description={currentTable.description}
              tableId={currentTable.tableId}
              tablesData={props.tablesData}
            />
          </Modal>
        )}
        {modalState.showModal && modalState.action == "addRelationship" && (
          <Modal heading={"Add Relationship"}>
            <AddRelationship
              sourceColumns={currentTable.columns}
              tableId={currentTable.tableId}
            />
          </Modal>
        )}
        {modalState.showModal && modalState.action == "addColumn" && (
          <Modal heading={"Add Column"}>
            <AddColumn tableId={currentTable.tableId} />
          </Modal>
        )}
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
            <button className={styles.delete} onClick={handleTable}>
              Delete Table
            </button>
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
                  <th>Delete</th>
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
                      <td className={styles.deleteCol}>
                        <MdDelete
                          className={styles.deleteIcon}
                          size={21}
                          onClick={() => {
                            handleColumn("delete", column.columnId);
                          }}
                        />
                      </td>
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
                <th>Column (Source)</th>
                <th>Table (Target)</th>
                <th>Column (Target)</th>
                <th>Delete</th>
              </thead>

              <tbody>
                {currentTable.relationships.map((relationship, id) => {
                  return (
                    <tr key={id} className={styles.rowData}>
                      <td>{id + 1}</td>
                      <td>{getColName(relationship, "source")}</td>
                      <td>{relationship.referenceTable}</td>
                      <td>{getColName(relationship, "target")}</td>
                      <td className={styles.deleteCol}>
                        <MdDelete
                          className={styles.deleteIcon}
                          size={21}
                          onClick={() => {
                            handleRelationship(
                              "delete",
                              relationship.relationshipId
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "editTable" }));
            }}
          >
            Edit Table
          </button>
          <button
            onClick={() => {
              dispatch(showModal({ showModal: true, action: "addColumn" }));
            }}
          >
            Add Column
          </button>
          <button
            onClick={() => {
              dispatch(
                showModal({ showModal: true, action: "addRelationship" })
              );
            }}
          >
            Add Relationship
          </button>
        </div>
      </div>
    );
  }
}

export default Table;
