import axios from "axios";
import { useState, useRef, useEffect, createRef } from "react";
import styles from "./offersManager.module.css";
import { IoSyncCircleSharp } from "react-icons/io5";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import cn from "classnames";
import Image from "next/image";
import { deleteCookie } from "cookies-next";

function OffersManager({ isAdmin }) {
  const [isLoggedIn, setIsLoggedIn] = useState(isAdmin === true ? true : false);
  const [loginText, setLoginText] = useState("Login");
  const [createNewOffer, setCreateNewOffer] = useState(false);
  const [getAllProductsState, setGetAllProductsState] = useState(false);
  const [insert, setInsert] = useState(false);
  const [dropDownArray, setDropDownArray] = useState();
  const [selectedDropdownValue, setSelectedDropdownValue] = useState();
  const [selectedDropdownName, setSelectedDropdownName] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const [offerAllProducts, setOfferAllProducts] = useState([]);
  const [getAllProductsPageNumber, setGetAllProductsPageNumber] = useState(1);
  const [defaultValues, setDefaultValues] = useState({});
  const [productModal, setProductModal] = useState();
  const [allProductsResponseData, setAllProductsResponseData] = useState();
  const [allProductsResponseDataIds, setAllProductsResponseDataIds] = useState([]);
  const [offerAllProductsResponseData, setOfferAllProductsResponseData] = useState();
  const [productAddButtons, setProductAddButtons] = useState({});
  const [reRender, setReRender] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const offerNameRef = useRef();
  const discountRef = useRef();
  const titleRef = useRef();
  const minPriceRef = useRef();
  const maxPriceRef = useRef();
  const minPrice_AfterDiscountRef = useRef();
  const maxPrice_AfterDiscountRef = useRef();
  const newDiscountInputRef = useRef();
  const dateTimeRef = useRef();
  const endingDateTimeRef = useRef();

  async function login() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    setLoginText("Logging In...");
    let options = {
      url: "http://localhost:8000/admin",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        username,
        password,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    setLoginText("Login");
    if (response.data.admin === true) {
      setIsLoggedIn(true);
    }
  }

  function notLoggedIn() {
    return (
      <div
        style={{
          fontSize: "3rem",
          display: "flex",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "black",
          color: "white",
          paddingTop: "200px",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <label>Username:</label>
          <input
            defaultValue={"Kamal Admin"}
            ref={usernameRef}
            style={{ fontSize: "3rem" }}
            type="text"
            name=""
            id=""
          />
        </div>
        <br />
        <div style={{ display: "flex", gap: "15px" }}>
          <label>Password:</label>
          <input
            defaultValue={"Admin Access"}
            ref={passwordRef}
            style={{ fontSize: "3rem" }}
            type="text"
            name=""
            id=""
          />
        </div>
        <br />
        <button
          disabled={loginText === "Login" ? false : true}
          style={{
            color: "white",
            backgroundColor: "red",
            padding: "10px 25px",
            borderRadius: "10px",
            fontSize: "2rem",
            userSelect: "none",
            transition: "all",
            transitionDuration: "1000ms",
          }}
          onClick={() => {
            login();
          }}
        >
          {loginText}
        </button>
      </div>
    );
  }

  async function createNewOffer_Func() {
    const offerName = offerNameRef.current.value;
    if (!offerName) {
      return;
    }
    let options = {
      url: "http://localhost:8000/createnewoffers",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        offerName,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
    setCreateNewOffer(false);
    getAllOffers();
  }

  async function getAllOffers() {
    let options = {
      url: "http://localhost:8000/getalloffers",
      method: "Get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    const tempArray = [];
    response.data.forEach((element, index) => {
      tempArray.push({ value: element["_id"], label: `${index + 1} : ${element["name"]}` });
    });
    setDropDownArray(tempArray);
    setSelectedDropdownValue(tempArray[0].value);
  }

  useEffect(() => {
    getAllOffers();
  }, []);

  async function getAllProducts() {
    const discount = discountRef.current.value;
    const title = titleRef.current.value;
    const minPrice = minPriceRef.current.value;
    const maxPrice = maxPriceRef.current.value;
    const minPrice_AfterDiscount = minPrice_AfterDiscountRef.current.value;
    const maxPrice_AfterDiscount = maxPrice_AfterDiscountRef.current.value;
    setDefaultValues((prev) => ({
      ...prev,
      discount,
      title,
      minPrice,
      maxPrice,
      minPrice_AfterDiscount,
      maxPrice_AfterDiscount,
    }));
    let options = {
      url: "http://localhost:8000/getallproducts",
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        pageNumber: getAllProductsPageNumber,
        discount,
        title,
        minPrice,
        maxPrice,
        minPrice_AfterDiscount,
        maxPrice_AfterDiscount,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    if (response.data) {
      setAllProductsResponseData(response.data);
    }
  }

  function allProductsHTML_Maker() {
    const tempArray = [];
    allProductsResponseData.map((element, index) => {
      element["index"] = index;
      if (allProductsResponseDataIds.includes(element["_id"])) {
        setProductAddButtons((prev) => ({ ...prev, [index]: true }));
      } else {
        setProductAddButtons((prev) => ({ ...prev, [index]: false }));
      }
      const temp = (
        <div key={index} className={styles.product}>
          <div>
            <img src={element.images[0]} className={styles.image} />
          </div>
          <div className={styles.productDetails}>
            <div>
              Title: <span>{element.title}</span>
            </div>
            <div>
              minPrice: <span>{element.minPrice}</span>
            </div>
            <div>
              maxPrice: <span>{element.maxPrice}</span>
            </div>
            <div>
              discount: <span>{element.discount}</span>
            </div>
            <div>
              minPrice_AfterDiscount: <span>{element.minPrice_AfterDiscount}</span>
            </div>
            <div>
              maxPrice_AfterDiscount: <span>{element.maxPrice_AfterDiscount}</span>
            </div>
            <div className={styles.buttons}>
              <a href={element.link} target="_blank">
                <button>Source</button>
              </a>
              <a href={`/product/${element["title"]}/${element["_id"]}`} target="_blank">
                <button>My Website</button>
              </a>
              {productAddButtons[index] === true ? (
                <button
                  onClick={() => {
                    setProductAddButtons((prev) => ({ ...prev, [index]: false }));
                    removeProductFromOffer(element["_id"]);
                    const tempArray = [];
                    allProductsResponseDataIds.forEach((element3, index2) => {
                      if (element3 != element["_id"]) {
                        tempArray.push(element3);
                      }
                    });
                    setAllProductsResponseDataIds(tempArray);
                    const tempArray2 = [];
                    offerAllProductsResponseData.forEach((element2) => {
                      if (element2["_id"] !== element["_id"]) {
                        tempArray.push(element2);
                      }
                    });
                    setOfferAllProductsResponseData(tempArray2);
                    setReRender((prev) => !prev);
                  }}
                >
                  Remove it
                </button>
              ) : (
                <button
                  onClick={() => {
                    setProductModal(element);
                  }}
                >
                  Add it
                </button>
              )}
            </div>
          </div>
        </div>
      );
      tempArray.push(temp);
    });
    setAllProducts(tempArray);
  }

  useEffect(() => {
    if (allProductsResponseData) {
      allProductsHTML_Maker();
    }
  }, [reRender, allProductsResponseData]);

  async function addOfferToServer(productId, newDiscount) {
    const offerId = selectedDropdownValue;
    const tempArray = allProductsResponseDataIds;
    const startingDateTime = dateTimeRef.current.value;
    const endingDateTime = endingDateTimeRef.current.value;

    if ((startingDateTime && !endingDateTime) || (!startingDateTime && endingDateTime)) {
      return;
    }

    tempArray.push(productId);
    setAllProductsResponseDataIds(tempArray);
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
        newDiscount,
        startingDateTime,
        endingDateTime,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
  }

  useEffect(() => {
    console.log(selectedDropdownValue);
  }, [selectedDropdownValue]);

  async function removeProductFromOffer(productId) {
    const offerId = selectedDropdownValue;

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

  function offerAllProductsHTML_Maker() {
    const tempArray = [];
    const tempArray2 = allProductsResponseDataIds;
    if (offerAllProductsResponseData.length === 0) {
      return setOfferAllProducts("No Data");
    }

    offerAllProductsResponseData.map((element, index) => {
      element["index"] = index;

      tempArray2.push(element["_id"]);
      const newRef = createRef();
      const temp = (
        <div ref={newRef} key={index} className={styles.product}>
          <div>
            <img src={element.images[0]} className={styles.image} />
          </div>
          <div className={styles.productDetails}>
            <div>
              Title: <span>{element.title}</span>
            </div>
            <div>
              minPrice: <span>{element.minPrice}</span>
            </div>
            <div>
              maxPrice: <span>{element.maxPrice}</span>
            </div>
            <div>
              discount: <span>{element.discount}</span>
            </div>
            <div>
              minPrice_AfterDiscount: <span>{element.minPrice_AfterDiscount}</span>
            </div>
            <div>
              maxPrice_AfterDiscount: <span>{element.maxPrice_AfterDiscount}</span>
            </div>
            <div className={styles.buttons}>
              <a href={element.link} target="_blank">
                <button>Source</button>
              </a>
              <a href={`/product/${element["title"]}/${element["_id"]}`} target="_blank">
                <button>My Website</button>
              </a>
              <button
                onClick={() => {
                  newRef.current.style.display = "none";
                  removeProductFromOffer(element["_id"]);
                  const tempArray = [];
                  allProductsResponseDataIds.forEach((element3, index2) => {
                    if (element3 != element["_id"]) {
                      tempArray.push(element3);
                    }
                  });
                  setAllProductsResponseDataIds(tempArray);
                  const tempArray2 = [];
                  offerAllProductsResponseData.forEach((element2) => {
                    if (element2["_id"] != element["_id"]) {
                      tempArray2.push(element2);
                    }
                  });
                  setOfferAllProductsResponseData(tempArray2);
                  setReRender((prev) => !prev);
                }}
              >
                Remove it
              </button>
            </div>
          </div>
        </div>
      );
      tempArray.push(temp);
    });
    setAllProductsResponseDataIds(tempArray2);
    setOfferAllProducts(tempArray);
  }

  async function getOfferData() {
    const offerId = selectedDropdownValue;
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

    const response = await axios(options).catch((error) => console.log(error));
    console.log(response);
    if (response.data) {
      setOfferAllProductsResponseData(response.data.data);
    }
  }

  useEffect(() => {
    if (offerAllProductsResponseData) {
      offerAllProductsHTML_Maker();
    }
  }, [offerAllProductsResponseData]);

  useEffect(() => {
    if (selectedDropdownValue) {
      getOfferData();
    }
  }, [selectedDropdownValue]);

  useEffect(() => {
    if (productModal) {
      newDiscountInputRef.current.focus();
    }
  }, [productModal]);

  function loggedIn() {
    return (
      <div className={styles.body}>
        <button
          onClick={() => {
            setIsLoggedIn(false);
            deleteCookie("admin_access_cookie");
          }}
          className={styles.reLogin}
        >
          <IoSyncCircleSharp />
        </button>

        {/* input discount modal */}
        {productModal ? (
          <div className={styles.newDiscountModal}>
            <div className={styles.product}>
              <div>
                <img src={productModal.images[0]} className={styles.image} />
              </div>
              <div className={styles.productDetails}>
                <div>
                  Title: <span>{productModal.title}</span>
                </div>
                <div>
                  minPrice: <span>{productModal.minPrice}</span>
                </div>
                <div>
                  maxPrice: <span>{productModal.maxPrice}</span>
                </div>
                <div>
                  discount: <span>{productModal.discount}</span>
                </div>
                <div>
                  minPrice_AfterDiscount: <span>{productModal.minPrice_AfterDiscount}</span>
                </div>
                <div>
                  maxPrice_AfterDiscount: <span>{productModal.maxPrice_AfterDiscount}</span>
                </div>

                <br />
                <div className={styles.newDiscountInputDiv}>
                  <label>Enter New Discount: </label>
                  <input
                    onKeyUp={(e) => {
                      if (e.key === "Enter" || e.keyCode === 13) {
                        if (!newDiscountInputRef.current.value) {
                          return newDiscountInputRef.current.focus();
                        }
                        const productId = productModal["_id"];
                        setProductModal(null);
                        setProductAddButtons((prev) => ({ ...prev, [productModal.index]: true }));
                        setReRender((prev) => !prev);
                        addOfferToServer(productId, newDiscountInputRef.current.value * 1);
                        getOfferData();
                      }
                    }}
                    ref={newDiscountInputRef}
                    placeholder="0"
                    type="number"
                  />
                </div>
                <br />

                <div>
                  <label>Enter Starting Date and Time: </label>
                  <input ref={dateTimeRef} type="datetime-local" />
                </div>
                <br />
                <div>
                  <label>Ending Date and Time: </label>
                  <input ref={endingDateTimeRef} type="datetime-local" />
                </div>
                <br />

                <div className={styles.addbuttonDiv}>
                  <button
                    className={styles.addbutton}
                    onClick={() => {
                      if (!newDiscountInputRef.current.value) {
                        return newDiscountInputRef.current.focus();
                      }
                      const startingDateTime = dateTimeRef.current.value;
                      const endingDateTime = endingDateTimeRef.current.value;
                      if (startingDateTime && !endingDateTime) {
                        return endingDateTimeRef.current.focus();
                      } else if (!startingDateTime && endingDateTime) {
                        return dateTimeRef.current.focus();
                      }
                      const productId = productModal["_id"];
                      setProductModal(null);
                      setProductAddButtons((prev) => ({ ...prev, [productModal.index]: true }));
                      setReRender((prev) => !prev);
                      addOfferToServer(productId, newDiscountInputRef.current.value * 1);
                      getOfferData();
                    }}
                  >
                    Add it
                  </button>
                  <button
                    className={styles.addbutton}
                    onClick={() => {
                      setProductModal(null);
                      // setProductAddButtons((prev) => ({ ...prev, [productModal.index]: true }));
                      // setReRender((prev) => !prev);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* create new offer */}
        {createNewOffer === true ? (
          <div className={styles.offerName}>
            <label>New Offer Name:</label>
            <input
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  createNewOffer_Func();
                }
              }}
              ref={offerNameRef}
              type="text"
              name=""
              id=""
            />
            <button onClick={() => createNewOffer_Func()}>Save</button>
            <button onClick={() => setCreateNewOffer(false)}>Cancel</button>
          </div>
        ) : insert === false ? (
          <div>
            <button onClick={() => setCreateNewOffer(true)} className={styles.newOfferButton}>
              Create New Offer
            </button>
            <br />
          </div>
        ) : (
          ""
        )}

        {/* dropdown */}

        {dropDownArray && createNewOffer === false ? (
          <div className={styles.dropdown}>
            <h4>Previous Offers:</h4>
            <Dropdown
              options={dropDownArray}
              value={dropDownArray[0]}
              onChange={(e) => {
                setSelectedDropdownValue(e.value);
                console.log(e);
                setSelectedDropdownName(e.label);
              }}
              placeholder="Select an option"
            />
            {insert === true ? (
              <div>
                <button
                  onClick={() => {
                    setInsert(false);
                    setGetAllProductsState(false);
                  }}
                  className={cn(styles.newOfferButton, styles.cancelInsertButton)}
                >
                  Cancel Inserting
                </button>
                {getAllProductsState === true ? (
                  <button
                    onClick={() => {
                      setAllProducts(null);
                      setGetAllProductsState(false);
                    }}
                    className={cn(styles.newOfferButton, styles.searchAgainButton)}
                  >
                    Search Again
                  </button>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setInsert(true);
                  setAllProducts(null);
                }}
                className={cn(styles.newOfferButton, styles.insertButton)}
              >
                Insert More Products
              </button>
            )}
          </div>
        ) : (
          ""
        )}

        {insert === false ? (
          <div className={styles.scroll}>
            <div className={styles.title}>Showing {selectedDropdownName} Data:</div>
            {offerAllProducts}
          </div>
        ) : (
          ""
        )}

        {/* discount upto */}
        {insert === true && getAllProductsState === false ? (
          <div>
            <div className={styles.discount}>
              <div>
                <label>Discount:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    titleRef.current.value = null;
                    minPriceRef.current.value = null;
                    maxPriceRef.current.value = null;
                    minPrice_AfterDiscountRef.current.value = null;
                    maxPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["discount"]}
                  ref={discountRef}
                  placeholder="0-100"
                  type="number"
                />
              </div>

              <div>
                <label>Title:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    discountRef.current.value = null;
                    minPriceRef.current.value = null;
                    maxPriceRef.current.value = null;
                    minPrice_AfterDiscountRef.current.value = null;
                    maxPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["title"]}
                  ref={titleRef}
                  placeholder="Name"
                  type="text"
                />
              </div>

              <div>
                <label>MinPrice:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    discountRef.current.value = null;
                    titleRef.current.value = null;
                    maxPriceRef.current.value = null;
                    minPrice_AfterDiscountRef.current.value = null;
                    maxPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["minPrice"]}
                  ref={minPriceRef}
                  placeholder="0.0"
                  type="number"
                />
              </div>

              <div>
                <label>MaxPrice:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    discountRef.current.value = null;
                    titleRef.current.value = null;
                    minPriceRef.current.value = null;
                    minPrice_AfterDiscountRef.current.value = null;
                    maxPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["maxPrice"]}
                  ref={maxPriceRef}
                  placeholder="0.0"
                  type="number"
                />
              </div>

              <div>
                <label>MinPrice_AfterDiscount:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    discountRef.current.value = null;
                    titleRef.current.value = null;
                    minPriceRef.current.value = null;
                    maxPriceRef.current.value = null;
                    maxPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["minPrice_AfterDiscount"]}
                  ref={minPrice_AfterDiscountRef}
                  placeholder="0.0"
                  type="number"
                />
              </div>

              <div>
                <label>MaxPrice_AfterDiscount:</label>
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.keyCode === 13) {
                      getAllProducts();
                      setGetAllProductsState(true);
                    }
                  }}
                  onInput={() => {
                    discountRef.current.value = null;
                    titleRef.current.value = null;
                    minPriceRef.current.value = null;
                    maxPriceRef.current.value = null;
                    minPrice_AfterDiscountRef.current.value = null;
                  }}
                  defaultValue={defaultValues["maxPrice_AfterDiscount"]}
                  ref={maxPrice_AfterDiscountRef}
                  placeholder="0.0"
                  type="number"
                />
              </div>

              <button
                onClick={() => {
                  getAllProducts();
                  setGetAllProductsState(true);
                  setReRender((prev) => !prev);
                }}
                className={cn(styles.newOfferButton, styles.insertButton)}
              >
                Get Products
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* discount end */}

        {insert === true && allProducts ? (
          <div className={styles.productsDiv}>{allProducts ? allProducts.map((element, index) => element) : ""}</div>
        ) : (
          ""
        )}

        {/* end div */}
      </div>
    );
  }

  return <div>{isLoggedIn === false ? notLoggedIn() : loggedIn()}</div>;
}

export async function getServerSideProps({ req }) {
  const token = req.cookies.admin_access_cookie;
  if (token) {
    return {
      props: { isAdmin: true },
    };
  }

  return {
    props: { isAdmin: false },
  };
}
export default OffersManager;
