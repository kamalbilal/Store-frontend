import SearchGrid from "./SearchGrid/SearchGrid";
import styles from "./SearchMain.module.css";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ImList2 } from "react-icons/im";
import cn from "classnames";
import { useEffect } from "react";

function SearchMain({
  data,
  totalProductsCount,
  title,
  titlePage,
  page,
  pageNumberState,
  pageCounterState,
  router,
  displayIn,
  totalProductLength,
}) {
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
        <div className={styles.foundTitle}>
          Found <span>"{totalProductsCount}"</span> products
        </div>
        <div className={styles.view}>
          <p>View:</p>
          <div onClick={() => setDisplayInGrid(true)} className={cn(styles.grid, displayInGrid === true ? styles.blueColor : "")}>
            <HiOutlineViewGrid />
          </div>
          <div onClick={() => setDisplayInGrid(false)} className={cn(styles.list, displayInGrid === false ? styles.blueColor : "")}>
            <ImList2 />
          </div>
        </div>
      </div>

      <SearchGrid
        data={data}
        totalProductsCount={totalProductsCount}
        title={title}
        titlePage={titlePage}
        page={page}
        pageNumberState={pageNumberState}
        pageCounterState={pageCounterState}
        router={router}
        displayInGrid={displayInGrid}
        totalProductLength={totalProductLength}
      />
    </div>
  );
}

export default SearchMain;
