import styles from "./addTable.module.scss";

function AddTable() {
  return (
    <div className={styles.main}>
      <input placeholder="Table name" />

      <input placeholder="Description name" />
    </div>
  );
}

export default AddTable;
