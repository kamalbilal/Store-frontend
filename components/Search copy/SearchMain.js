import SearchGrid from "./SearchGrid/SearchGrid";
import styles from "./SearchMain.module.css";
import { HiOutlineViewGrid } from "react-icons/hi";
import { ImList2 } from "react-icons/im";
import cn from "classnames";
import { useEffect, useRef } from "react";

function SearchMain({
  data,
  totalProductsCount,
  title,
  titlePageSort,
  page,
  pageNumberState,
  pageCounterState,
  router,
  displayIn,
  totalProductLength,
  sortby,
}) {
  const { displayInGrid, setDisplayInGrid } = displayIn;

  const sortByMatchBtn = useRef();
  const sortByPriceBtn = useRef();

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

  function sortByMatch() {
    sortByPriceBtn.current.classList.remove(styles.sortBySelectedPrice);
    sortByMatchBtn.current.classList.add(styles.sortBySelectedMatch);
  }
  function sortByPrice() {
    sortByMatchBtn.current.classList.remove(styles.sortBySelectedMatch);
    sortByPriceBtn.current.classList.add(styles.sortBySelectedPrice);
  }

  return (
    <div>
      <div className={styles.viewDiv}>
        <div className={styles.foundTitle}>
          Found <span>"{totalProductsCount}"</span> products
        </div>
        <div className={styles.right}>
          <div className={styles.sortBy}>
            <p>Sort By:</p>
            <button onClick={sortByMatch} ref={sortByMatchBtn} className={styles.sortBySelectedMatch}>
              Best Match
            </button>
            <button onClick={sortByPrice} ref={sortByPriceBtn}>
              Price
            </button>
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
      </div>

      <SearchGrid
        data={data}
        totalProductsCount={totalProductsCount}
        title={title}
        titlePageSort={titlePageSort}
        page={page}
        pageNumberState={pageNumberState}
        pageCounterState={pageCounterState}
        router={router}
        displayInGrid={displayInGrid}
        totalProductLength={totalProductLength}
        sortby={sortby}
      />
    </div>
  );
}

export default SearchMain;