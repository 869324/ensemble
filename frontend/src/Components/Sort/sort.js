import styles from "./sort.module.scss";

function Sort(props) {
  return (
    <div className={styles.sortDiv}>
      <label className={styles.sortText}>Sort</label>
      <select
        className={styles.sort}
        name="order"
        onChange={props.handleChange}
      >
        {props.options.map((option, id) => {
          const names = option.split("_");

          names[0] =
            names[0].charAt(0) +
            names[0].slice(1, names[0].length).toLowerCase();

          return (
            <option key={id} value={option}>
              {names.join(" ")}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Sort;
