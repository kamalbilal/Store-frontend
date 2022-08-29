import SearchGrid from "./SearchGrid/SearchGrid";
import styles from "./SearchMain.module.css";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ImList2 } from "react-icons/im";
import cn from "classnames";
import { useEffect } from "react";

function SearchMain({ data, title, titlePage, page, pageNumberState, pageCounterState, router, displayIn }) {
  const { displayInGrid, setDisplayInGrid } = displayIn;

  useEffect(() => {
    function handler(e) {
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        e.stopPropagation();
        setDisplayInGrid((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div>
      <div className={styles.viewDiv}>
        <div></div>
        <div className={styles.view}>
          <p>View:</p>
          <div
            onClick={() => setDisplayInGrid(true)}
            className={cn(styles.grid, displayInGrid === true ? styles.blueColor : "")}
          >
            <HiOutlineViewGrid />
          </div>
          <div
            onClick={() => setDisplayInGrid(false)}
            className={cn(styles.list, displayInGrid === false ? styles.blueColor : "")}
          >
            <ImList2 />
          </div>
        </div>
      </div>
      
        <SearchGrid
          data={data}
          title={title}
          titlePage={titlePage}
          page={page}
          pageNumberState={pageNumberState}
          pageCounterState={pageCounterState}
          router={router}
          displayInGrid={displayInGrid}
        />
     
    </div>
  );
}

export default SearchMain;