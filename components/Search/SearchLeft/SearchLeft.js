import styles from "./SearchLeft.module.css";
function SearchLeft({ searchedData, title, pageCounter, pageNumber }) {
  return (
    <div>
      <button onClick={() => console.log({ searchedData, title, pageCounter, pageNumber })}>test</button>
      <div className={styles.price}>
        <div>Price:</div>
        <div className={styles.priceInput}>
          <input size={4} type="text" name="" id="" placeholder="Min" />
        </div>
        <div>-</div>
        <div className={styles.priceInput}>
          <input size={4} type="text" name="" id="" placeholder="Max" />
        </div>
      </div>
    </div>
  );
}

export default SearchLeft;
