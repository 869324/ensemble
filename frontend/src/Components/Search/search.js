import { useDispatch } from "react-redux";
import styles from "./search.module.scss";
import { AiOutlineSearch } from "react-icons/ai";

function Search(props) {
  const dispatch = useDispatch();
  return (
    <div className={styles.searchDiv}>
      <input
        className={styles.search}
        name="name"
        onChange={props.debouncedSearch}
        placeholder="Search"
      />
      <AiOutlineSearch
        className={styles.searchIcon}
        size={28}
        onClick={() => dispatch(props.method(props.data))}
      />
    </div>
  );
}

export default Search;
