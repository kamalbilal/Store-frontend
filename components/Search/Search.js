import styles from "./Search.module.css";
import { useEffect } from "react";

function Search({ title, page }) {
  useEffect(() => {
    console.log(page);
  }, []);

  return (
    <div className={styles.body}>
      <div>left</div>
      <div>Products</div>
    </div>
  );
}

export default Search;
