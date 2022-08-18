import Tabs from "./helpers/Tabs";
import styles from "./OfferManager.module.css";
import { useState, useEffect } from "react";
import ModifyOffer from "./helpers/ModifyOffer/ModifyOffer";
import { useContext } from "react";
import { AllOffersData_context, OffersData_context } from "../../../userContext";
import InsertProducts from "./helpers/InsertProducts/InsertProducts";

function OfferManager({ id }) {
  const { allOffersData, setallOffersData } = useContext(AllOffersData_context);
  const { offersData, setOffersData } = useContext(OffersData_context);
  const [activeTab, setActiveTab] = useState(0); // 0 for modify and 1 for insert
  const [offerData, setofferData] = useState(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [insertOfferRequest, setInsertOfferRequest] = useState(false);
  const [insertOfferData, setInsertOfferData] = useState();
  const [reRenderInsertOfferData, setReRenderInsertOfferData] = useState(false);
  const [reRenderOfferData, setReRenderOfferData] = useState(false);

  console.log(insertOfferRequest);
  useEffect(() => {
    console.log(insertOfferData);
  }, [insertOfferData]);
  useEffect(() => {
    console.log(offerData);
  }, [offerData]);

  return (
    <div className={styles.body}>
      <Tabs insertOfferRequest={{ insertOfferRequest, setInsertOfferRequest }} setActiveTab={setActiveTab} />
      <div style={{ display: activeTab === 0 ? "block" : "none" }}>
        <ModifyOffer
          offerId={id}
          offerData={offerData}
          setofferData={setofferData}
          allOffersData={{ allOffersData, setallOffersData }}
          offersData={{ offersData, setOffersData }}
          insertOfferData={{ insertOfferData, setInsertOfferData }}
          setReRenderInsertOfferData={setReRenderInsertOfferData}
          reRenderOfferData={reRenderOfferData}
        />
      </div>
      <div style={{ display: activeTab === 0 ? "none" : "block" }}>
        <InsertProducts
          insertOfferData={{ insertOfferData, setInsertOfferData }}
          insertOfferRequest={{ insertOfferRequest, setInsertOfferRequest }}
          offerId={id}
          offerData={{ offerData, setofferData }}
          allOffersData={{ allOffersData, setallOffersData }}
          defaultValuesObject={{ defaultValues, setDefaultValues }}
          reRenderInsertOfferData={reRenderInsertOfferData}
          setReRenderOfferData={setReRenderOfferData}
          offersData={{ offersData, setOffersData }}
        />
      </div>
    </div>
  );
}

export default OfferManager;
