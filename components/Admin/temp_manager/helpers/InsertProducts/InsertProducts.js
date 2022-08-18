import styles from "./InsertProducts.module.css";
import ProductQuery from "./helpers/ProductQuery";
import ShowAllProducts from "./helpers/ShowAllProducts";
function InsertProducts({
  defaultValuesObject,
  insertOfferRequest,
  offerId,
  insertOfferData,
  allOffersData,
  offerData,
  offersData,
  reRenderInsertOfferData,
  setReRenderOfferData,
}) {
  return (
    <div>
      {insertOfferRequest.insertOfferRequest === false ? (
        <ProductQuery
          offerData={offerData}
          setInsertOfferRequest={insertOfferRequest.setInsertOfferRequest}
          setInsertOfferData={insertOfferData.setInsertOfferData}
          defaultValuesObject={defaultValuesObject}
        />
      ) : (
        <ShowAllProducts
          offerData={offerData}
          offerId={offerId}
          insertOfferData={insertOfferData}
          reRenderInsertOfferData={reRenderInsertOfferData}
          setReRenderOfferData={setReRenderOfferData}
          allOffersData={allOffersData}
          offersData={offersData}
        />
      )}
    </div>
  );
}

export default InsertProducts;
