import Image from "next/image";
import styles from "./ShowAllProducts.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function ShowAllProducts({
  insertOfferData,
  offerId,
  offerData,
  offersData,
  reRenderInsertOfferData,
  setReRenderOfferData,
  allOffersData,
}) {
  const [searchTerm, setSearchTerm] = useState(null);
  const [inputDefaultValues, setInputDefaultValues] = useState({});

  Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
  };

  function newDiscounts() {
    const temp = [];
    insertOfferData.insertOfferData.forEach((element, index) => {
      const price_AfterDiscount = (element.maxPrice - (element.newDiscount / 100) * element.maxPrice).round(2);
      temp.push({ ...insertOfferData.insertOfferData[index], myWebsitePrice_AfterDiscount: price_AfterDiscount });
      setInputDefaultValues((prev) => ({ ...prev, [index]: element.newDiscount }));
    });
    insertOfferData.setInsertOfferData(temp);
  }

  useEffect(() => {
    newDiscounts();
  }, []);

  useEffect(() => {
    newDiscounts();
  }, [reRenderInsertOfferData]);

  async function changeMyWebsitePriceAfterDicount(index, inputValue) {
    const temp = insertOfferData.insertOfferData;
    const price_AfterDiscount = (temp[index].maxPrice - (inputValue / 100) * temp[index].maxPrice).round(2);
    temp[index].myWebsitePrice_AfterDiscount = price_AfterDiscount;
    insertOfferData.setInsertOfferData([...temp]);
  }

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        changeMyWebsitePriceAfterDicount(searchTerm.index, searchTerm.inputValue);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  async function addOfferToContext() {
    const productId = searchTerm.productId;
    const newDiscount = searchTerm.inputValue;
    const index = searchTerm.index;

    const temp = insertOfferData.insertOfferData;
    temp[index].newDiscount = newDiscount;
    insertOfferData.setInsertOfferData([...temp]);

    // add to offerData in modify offer tab
    const newTemp = offerData.offerData;
    if (newTemp.offers.includes(temp[index]._id)) {
      newTemp.offers = removeItemOnce(newTemp.offers, temp[index]._id);
      newTemp.allProducts = newTemp.allProducts.filter(function (el) {
        return el._id != temp[index]._id;
      });
    }
    newTemp.offers.push(temp[index]._id);
    newTemp.allProducts.push(temp[index]);

    offerData.setofferData({ ...newTemp });

    // add to offersData
    const newTemp2 = offersData.offersData[offerId];
    if (newTemp2.offers.includes(temp[index]._id)) {
      newTemp2.offers = removeItemOnce(newTemp2.offers, temp[index]._id);
      newTemp2.allProducts = newTemp2.allProducts.filter(function (el) {
        return el._id != temp[index]._id;
      });
    }
    newTemp2.offers.push(temp[index]._id);
    newTemp2.allProducts.push(temp[index]);

    offersData.setOffersData((prev) => ({ ...prev, [offerId]: { ...newTemp2 } }));

    // add to allOffersData
    if (allOffersData.allOffersData) {
      const temp2 = allOffersData.allOffersData;
      temp2.forEach((element, index2) => {
        if (element._id === offerId) {
          if (!element.offers.includes(productId)) {
            temp2[index2].offers.push(productId);
          }
        }
      });
      allOffersData.setallOffersData(temp2);
    }
  }

  async function addOfferToServer() {
    if (!searchTerm) return console.log("Please enter new price");
    if (!searchTerm.hasOwnProperty("inputValue")) return console.log("Please enter new price");
    addOfferToContext();
    setReRenderOfferData((prev) => !prev);

    const productId = searchTerm.productId;
    const newDiscount = searchTerm.inputValue;
    const index = searchTerm.index;

    let options = {
      url: "http://localhost:8000/addoffer",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        productId,
        offerId,
        offerName: offersData.offersData[offerId].name,
        newDiscount,
        startingDateTime: null,
        endingDateTime: null,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
    setSearchTerm(null);
  }

  async function removeFromContext(productId) {
    // removing from offerData
    const temp = offerData.offerData;
    temp.offers = removeItemOnce(temp.offers, productId);
    temp.allProducts = temp.allProducts.filter(function (el) {
      return el._id != productId;
    });
    offerData.setofferData({ ...temp });

    // reseting myWebsitePrice_AfterDiscount from insertOfferData
    const temp1 = insertOfferData.insertOfferData;
    temp1.forEach((element, index) => {
      if (element._id === productId) {
        temp1[index]["myWebsitePrice_AfterDiscount"] = element.maxPrice;
      }
    });
    insertOfferData.setInsertOfferData([...temp1]);

    // remove from offersData
    const newTemp2 = offersData.offersData[offerId];
    if (newTemp2.offers.includes(productId)) {
      newTemp2.offers = removeItemOnce(newTemp2.offers, productId);
      newTemp2.allProducts = newTemp2.allProducts.filter(function (el) {
        return el._id != productId;
      });
    }
    offersData.setOffersData((prev) => ({ ...prev, [offerId]: { ...newTemp2 } }));

    // removing from allOffersData
    if (allOffersData.allOffersData) {
      const newTemp3 = allOffersData.allOffersData;
      allOffersData.allOffersData.forEach((element, index) => {
        if (element.offers.includes(productId)) {
          newTemp3[index].offers = removeItemOnce(element.offers, productId);
        }
      });

      allOffersData.setallOffersData(newTemp3);
    }
  }

  async function removeProductFromOffer(productId) {
    removeFromContext(productId);
    resetProductNewDiscountToServer(productId);
    let options = {
      url: "http://localhost:8000/removeproductfromoffer",
      method: "POST",
      // credentials: "include",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        productId,
        offerId,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response.data);
  }

  async function resetProductNewDiscountFromContext(productId) {
    const temp = [];
    insertOfferData.insertOfferData.forEach((element, index) => {
      if (element._id === productId) {
        element.newDiscount = 0;
        setInputDefaultValues((prev) => ({ ...prev, [index]: 0 }));
      }
      temp.push(element);
    });
    insertOfferData.setInsertOfferData([...temp]);
  }

  async function resetProductNewDiscountToServer(productId) {
    resetProductNewDiscountFromContext(productId);

    // removed because already resetting in removeProductFromOffer
    // let options = {
    //   url: "http://localhost:8000/resetproductnewdiscount",
    //   method: "POST",
    //   // credentials: "include",
    //   // withCredentials: true,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     productId,
    //     pwd: "Kamal",
    //   },
    // };

    // const response = await axios(options).catch((error) => console.log(error));
    // console.log(response);
  }
  const onChange = (e, index) => {
    setInputDefaultValues((prev) => ({ ...prev, [index]: e.target.value }));
  };

  return (
    <div>
      <div className={styles.scroll}>
        {insertOfferData.insertOfferData.map((element, index) => {
          const alreadyInOffer = offerData.offerData.offers.includes(element._id);
          return (
            <div key={index}>
              <div className={styles.grid}>
                <div>
                  <Image src={element.images[0]} width={250} height={250} />
                </div>
                <div className={styles.details}>
                  <div>
                    Count = <span>{index + 1}</span>
                  </div>
                  <div>
                    Title = <span>{element.title}</span>
                  </div>
                  <div>
                    Source Discount = <span>{element.discountNumber} %OFF</span>
                  </div>
                  <div>
                    Source MaxPrice = <span>${element.maxPrice}</span>
                  </div>
                  <div>
                    Source MaxPrice_AfterDiscount = <span>${element.maxPrice_AfterDiscount}</span>
                  </div>
                  <div>
                    Source MinPrice = <span>${element.minPrice}</span>
                  </div>
                  <div>
                    Source MinPrice_AfterDiscount = <span>${element.minPrice_AfterDiscount}</span>
                  </div>
                  <br />
                  <div className={styles.newDiscount}>
                    MyWebsite Discount = <span>{element.newDiscount} %OFF</span>
                    <div className={styles.input}>
                      <input
                        onInput={(e) => {
                          const inputValue = e.target.value * 1;
                          setSearchTerm({ index, inputValue, productId: element._id });
                        }}
                        placeholder="0"
                        value={inputDefaultValues[index] || 0}
                        onChange={(e) => onChange(e, index)}
                        type="number"
                      />
                      <div>My Website New Price will be = ${element.myWebsitePrice_AfterDiscount}</div>
                    </div>
                  </div>
                  <br />
                  <div className={styles.buttons}>
                    <div>
                      <a target="_blank" href={element.link}>
                        View Source
                      </a>

                      <a target="_blank" href={`/product/${element.title}/${element._id}`}>
                        My Website
                      </a>
                    </div>
                    <div>
                      {alreadyInOffer ? (
                        <button onClick={addOfferToServer} className={styles.changeBtn}>
                          Change
                        </button>
                      ) : (
                        ""
                      )}
                      <button
                        id={element._id}
                        onClick={(e) => {
                          if (alreadyInOffer) {
                            const productId = e.target.id;
                            removeProductFromOffer(productId);
                          } else {
                            addOfferToServer();
                          }
                        }}
                        className={alreadyInOffer ? styles.removeBtn : styles.insertBtn}
                      >
                        {alreadyInOffer ? "Remove" : "Insert"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )
    </div>
  );
}

export default ShowAllProducts;
