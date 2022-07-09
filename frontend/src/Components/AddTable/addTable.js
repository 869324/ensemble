import { useEffect, useState } from "react";
import styles from "./addTable.module.scss";

import {
  createTable,
  getTables,
  tableReset,
} from "../../StateManagement/Reducers/tablesReducer";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill, RiDeleteColumn } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import swal from "sweetalert";
import {
  showModal,
  resetModal,
} from "../../StateManagement/Reducers/modalReducer";
import { useNavigate } from "react-router-dom";

function AddTable(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tableState = useSelector((state) => state.tables.createTable);

  const [tableData, setTableData] = useState({
    name: "",
    description: "",
    project: props.currentProject,
  });

  const [columnsData, setColumnsData] = useState([]);

  useEffect(() => {
    const { loading, error, status, tried } = tableState;

    if (tried) {
      if (status) {
        dispatch(getTables(props.tablesData));
        swal({
          title: "Table has been created",
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
      dispatch(getTables(props.tablesData));
      dispatch(tableReset("createTable"));
    };
  }, []);

  function addColumn() {
    setColumnsData((prev) => [
      ...prev,
      { name: "", description: "", dataType: "", owner: props.currentProject },
    ]);
  }

  function handleTableChange(e) {
    setTableData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const changeColumn = (e, id) => {
    const newData = [...columnsData];
    let column = { ...newData[id], [e.target.name]: e.target.value };
    newData.splice(id, 1, column);
    setColumnsData(newData);
  };

  function deleteColumn(id) {
    const newData = [...columnsData];
    newData.splice(id, 1);
    setColumnsData(newData);
  }

  function submit(e) {
    e.preventDefault();
    dispatch(
      createTable({
        table: tableData,
        columns: columnsData,
      })
    );
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
              onChange={handleTableChange}
              required
            />
          </div>

          <div className={styles.inputDiv}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.input}
              name="description"
              onChange={handleTableChange}
            />
          </div>
        </div>

        <div className={styles.selectionData}>
          <div className={styles.colSelect}>
            <div className={styles.header}>
              <h4>Columns</h4>
              <RiAddFill
                className={styles.addIcon}
                size={28}
                onClick={addColumn}
              />
            </div>

            <div className={styles.header}>
              <h5>Name</h5>
              <h5>Description</h5>
              <h5>Data type</h5>
              <h5 className={styles.h5Delete}>Delete</h5>
            </div>

            {columnsData.map((column, id) => {
              return (
                <div key={id} className={styles.header}>
                  <input
                    className={styles.dataInput}
                    name="name"
                    value={column.name}
                    placeholder="Name"
                    onChange={(e) => changeColumn(e, id)}
                  />
                  <input
                    className={styles.dataInput}
                    name="description"
                    value={column.description}
                    placeholder="Description"
                    onChange={(e) => changeColumn(e, id)}
                  />
                  <input
                    className={styles.dataInput}
                    name="dataType"
                    value={column.datatype}
                    placeholder="Data type"
                    onChange={(e) => changeColumn(e, id)}
                  />

                  <div className={styles.delete}>
                    <MdDelete
                      className={styles.deleteIcon}
                      size={21}
                      onClick={() => {
                        deleteColumn(id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddTable;
