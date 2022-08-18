import styles from "./Tabs.module.css";
import { useRef } from "react";
import { IoSyncCircleSharp } from "react-icons/io5";

function Tabs({ setActiveTab, insertOfferRequest }) {
  const modifyButtonRef = useRef();
  const insertButtonRef = useRef();
  return (
    <div className={styles.tab}>
      <button
        className={styles.active}
        onClick={() => {
          insertButtonRef.current.classList.remove(styles.active);
          modifyButtonRef.current.classList.add(styles.active);
          setActiveTab(0);
        }}
        ref={modifyButtonRef}
      >
        Modify Offer
      </button>

      <button
        onClick={() => {
          modifyButtonRef.current.classList.remove(styles.active);
          insertButtonRef.current.classList.add(styles.active);
          setActiveTab(1);
        }}
        ref={insertButtonRef}
      >
        Insert Products
      </button>
      {insertOfferRequest.insertOfferRequest === true ? (
        <button onClick={() => insertOfferRequest.setInsertOfferRequest(false)} className={styles.research}>
          <IoSyncCircleSharp />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default Tabs;
