import styles from "./ModifyOffer.module.css";
import modalStyles from "../../../loggedIn/helpers/CreateNewOffer.module.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ShowingAllProducts from "./helpers/ShowingAllProducts";

function ModifyOffer({
  offerId,
  offerData,
  setofferData,
  allOffersData,
  offersData,
  insertOfferData,
  setReRenderInsertOfferData,
  reRenderOfferData,
}) {
  const router = useRouter();
  const modalRef = useRef();
  const offerNameRef = useRef();
  const renameBtnRef = useRef();
  const runUseEffect = useRef(true);
  const [renameBtnText, setRenameBtnText] = useState("Rename");

  async function getOfferData() {
    let options = {
      url: "http://localhost:8000/getofferdata",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId: offerId,
        pwd: "Kamal",
      },
    };
    const response = await axios(options).catch((error) => {
      console.log("Axios Catch Error");
      console.log(error);
    });
    console.log(response);
    if (!response) {
      return console.log("getofferdata Response Error 404");
    }
    console.log("Successfully Got OfferData");

    //
    setofferData(response.data[0]);
    offersData.setOffersData((prev) => ({ ...prev, [offerId]: response.data[0] }));
  }

  async function getOfferDataFromContext() {
    console.log("Getting getOfferData from context");
    console.log(offersData.offersData);
    setofferData(offersData.offersData[offerId]);
  }

  useEffect(() => {
    if (!offerData && runUseEffect.current === true && offersData.offersData) {
      if (offersData.offersData.hasOwnProperty(offerId)) {
        getOfferDataFromContext();
      } else {
        runUseEffect.current = false;
        console.log("Getting getOfferData from API");
        getOfferData();
      }
    }
  }, [offerData]);

  function confirmDelete() {
    const answer = window.confirm(`Delete this offer?\nOffer = ${offerData.name}`);
    if (answer) {
      deleteOffer();
    } else {
      return;
    }
  }

  async function deleteOffer() {
    console.log(offersData.offersData[offerId].offers);
    let options = {
      url: "http://localhost:8000/deleteoffer",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        activeOffers: offersData.offersData[offerId].offers,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    if (!response) return console.log("error");
    deleteInContext();
  }

  async function deleteInContext() {
    if (!allOffersData.allOffersData) {
      router.push("/admin/offers");
      return;
    }
    const tempArray = [];
    for (let index = 0; index < allOffersData.allOffersData.length; index++) {
      if (allOffersData.allOffersData[index]._id != offerId) {
        tempArray.push(allOffersData.allOffersData[index]);
      }
    }
    allOffersData.setallOffersData(tempArray);

    const tempObject = offersData.offersData;
    delete tempObject[offerId];
    offersData.setOffersData(tempObject);
    router.push("/admin/offers");
  }

  async function on_Off(on) {
    let options = {
      url: "http://localhost:8000/offertoggle",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        on_off: on,
        pwd: "Kamal",
      },
    };

    setofferData((prev) => ({ ...prev, display: on }));
    on_OffInContext(on);
    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
  }

  async function on_OffInContext(on) {
    const tempArray = [];
    for (let index = 0; index < allOffersData.allOffersData.length; index++) {
      if (allOffersData.allOffersData[index]._id == offerId) {
        tempArray.push({ ...allOffersData.allOffersData[index], display: on });
      } else {
        tempArray.push(allOffersData.allOffersData[index]);
      }
    }
    allOffersData.setallOffersData(tempArray);
    offersData.setOffersData((prev) => ({ ...prev, [offerId]: { ...offersData.offersData[offerId], display: on } }));
  }

  async function renameOffer_Func() {
    const offerName = offerNameRef.current.value;
    if (!offerName) {
      return;
    }
    renameBtnRef.current.disabled = true;
    setRenameBtnText("Renaming...");
    let options = {
      url: "http://localhost:8000/renameoffer",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerId,
        offerName,
        activeOffers: offersData.offersData[offerId].offers,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => {
      setRenameBtnText("Rename");
      console.log(error);
    });

    setRenameBtnText("Rename");

    if (!response.hasOwnProperty("data"))
      if (response["data"]["success"] === true) {
        offerNameRef.current.value = "";
        console.log(response["data"]);
      }
    renameBtnRef.current.disabled = false;
    setofferData((prev) => ({ ...prev, name: offerName }));
    renameInContext(offerName);
  }
  async function renameInContext(newName) {
    if (!allOffersData.allOffersData) return;
    const tempArray = [];
    for (let index = 0; index < allOffersData.allOffersData.length; index++) {
      if (allOffersData.allOffersData[index]._id == offerId) {
        tempArray.push({ ...allOffersData.allOffersData[index], name: newName });
      } else {
        tempArray.push(allOffersData.allOffersData[index]);
      }
    }
    allOffersData.setallOffersData(tempArray);
    offersData.setOffersData((prev) => ({ ...prev, [offerId]: { ...offersData.offersData[offerId], name: newName } }));
  }

  return (
    <div>
      {/* modal */}
      <div
        style={{ top: "0" }}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          modalRef.current.style.display = "none";
        }}
        ref={modalRef}
        className={modalStyles.modal}
      >
        <div>
          <label>Rename: </label>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                renameOffer_Func();
              }
            }}
            ref={offerNameRef}
            placeholder="New Offer name"
            type="text"
          />
          <div className={modalStyles.buttonsDiv}>
            <button onClick={renameOffer_Func} className={modalStyles.button}>
              {renameBtnText}
            </button>
            <button className={modalStyles.button} onClick={() => (modalRef.current.style.display = "none")}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      {/* modal end*/}
      {offerData ? (
        <div className={styles.offerTitle}>
          <span>OfferName = </span>
          {offerData.name}
        </div>
      ) : (
        ""
      )}
      <div className={styles.buttons}>
        <button
          ref={renameBtnRef}
          onClick={() => {
            modalRef.current.style.display = "block";
            offerNameRef.current.focus();
          }}
          className={styles.rename}
        >
          Rename
        </button>
        {offerData ? (
          <button
            onClick={() => (offerData.display === false ? on_Off(true) : on_Off(false))}
            className={offerData.display === false ? styles.off : ""}
          >
            Currently {offerData.display === false ? "OFF" : "ON"}
          </button>
        ) : (
          "Loading state"
        )}
        <button onClick={confirmDelete} className={styles.delete}>
          Delete
        </button>
      </div>
      {offerData !== null ? (
        <ShowingAllProducts
          offerData={{ offerData, setofferData }}
          insertOfferData={insertOfferData}
          offerId={offerId}
          setReRenderInsertOfferData={setReRenderInsertOfferData}
          reRenderOfferData={reRenderOfferData}
          allOffersData={allOffersData}
          offersData={offersData}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ModifyOffer;
