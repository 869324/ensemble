import { useEffect, useState } from "react";
import styles from "./addTable.module.scss";

import { createTable } from "../../StateManagement/Reducers/tablesReducer";
import { useDispatch } from "react-redux";
import { RiAddFill, RiDeleteColumn } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

function AddTable(props) {
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState({
    name: "",
    description: "",
    project: props.currentProject,
  });

  const [columnsData, setColumnsData] = useState([]);
  const [relationshipsData, setRelationshipsData] = useState([]);

  function addRelation() {
    setRelationshipsData((prev) => [
      ...prev,
      { sourceId: "", target: "", targetId: "" },
    ]);
  }

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
        relationships: relationshipsData,
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
              <h5>Delete</h5>
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

                  <MdDelete
                    className={styles.deleteIcon}
                    size={21}
                    onClick={() => {
                      deleteColumn(id);
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles.rSelect}>
            <div className={styles.header}>
              <h4>Relationships</h4>
              <RiAddFill
                className={styles.addIcon}
                size={28}
                onClick={addRelation}
              />
            </div>
            {relationshipsData.map((rship, id) => {
              return <div>{rship.target}</div>;
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
