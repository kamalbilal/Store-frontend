import styles from "./SearchGrid.module.css";
import { useEffect, useState, useRef, useContext, createRef, memo } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import cn from "classnames";

function SearchGrid({
  title,
  page,
  data,
  totalProductsCount,
  titlePageSort,
  pageNumberState,
  pageCounterState,
  router,
  displayInGrid,
  totalProductLength,
  sortby,
}) {
  const { searchedData, setSearchedData } = data;
  const { pageNumber, setPageNumber } = pageNumberState;
  const { pageCounter, setPageCounter } = pageCounterState;

  const showMoreButtonAfterPages = 3;

  const [isGettingSearchedProducts, setIsGettingSearchedProducts] = useState(false);

  const mainDivRef = useRef();
  const showMoreBtnDivRef = useRef();
  const showMoreBtnRef = useRef();
  const noMoreProductsRef = useRef();
  const loaderRef = useRef();
  const runThisEffectOnce = true; // always use this one, dont remove this

  async function getSearchedProducts(pagenumber) {
    if (searchedData[title][titlePageSort]["runtime"] === false) return;
    setIsGettingSearchedProducts(true);
    let options = {
      url: "http://localhost:8000/getsearchedproducts",
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        title: title,
        pageNumber: pagenumber,
        count: totalProductsCount,
        pwd: "Kamal",
      },
    };

    // setTimeout(async () => {
    showLoader();
    const response = await axios(options).catch((error) => console.log(error));
    setIsGettingSearchedProducts(false);
    hideLoader();
    if (!response) return console.log("response error");
    if (response.data.success === true) {
      console.log(pageNumber);
      console.log(response.data);
      if (response.data.products.length > 0) {
        setSearchedData((prev) => ({
          ...prev,
          [title]: {
            ...searchedData[title],
            [titlePageSort]: {
              ...searchedData[title][titlePageSort],
              data: [...searchedData[title][titlePageSort]["data"], ...response.data.products],
            },
          },
        }));
      } else {
        setPageNumber((prev) => prev - 1);
        //
      }
    }
    // }, 5000);
  }

  function showLoader() {
    loaderRef.current.style.display = "flex";
  }
  function hideLoader() {
    loaderRef.current.style.display = "none";
  }

  function hide_ShowMoreBtn() {
    showMoreBtnDivRef.current.classList.remove(styles.show);
  }
  function show_ShowMoreBtn() {
    hideLoader();
    hide_noMoreProducts();
    showMoreBtnDivRef.current.classList.add(styles.show);
    console.log(showMoreBtnDivRef.current.classList);
  }
  function hide_noMoreProducts() {
    noMoreProductsRef.current.classList.remove(styles.show);
  }
  function show_noMoreProducts() {
    hide_ShowMoreBtn();
    hideLoader();
    noMoreProductsRef.current.classList.add(styles.show);
  }

  useEffect(() => {
    let observer;
    const current = location.href;
    let currentPage = current.split("page=")[1].split("&")[0];
    currentPage = isNaN(currentPage) ? "" : currentPage * 1;

    const title = current.split("title=")[1].split("&")[0];
    const sort = current.split("sortby=")[1];
    const titlePageSort = `${title}_${currentPage}_${sort}`;

    if (searchedData.hasOwnProperty(title) && searchedData[title].hasOwnProperty(titlePageSort)) {
      if (searchedData[title][titlePageSort]["runtime"] === false && isGettingSearchedProducts === false) {
        hideLoader();
        show_ShowMoreBtn();
      } else if (
        searchedData[title][titlePageSort]["runtime"] === true &&
        searchedData[title][titlePageSort]["noMoreProducts"] === false &&
        searchedData[title][titlePageSort]["data"].length > 0
      ) {
        const lastProduct = document.querySelector(".allSearchedProducts:last-of-type");
        if (pageCounter[titlePageSort] <= showMoreButtonAfterPages && isGettingSearchedProducts === false) {
          observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  observer.unobserve(entry.target);
                  observer.disconnect();
                  console.log(pageCounter[titlePageSort]);
                  if (pageCounter[titlePageSort] <= showMoreButtonAfterPages && isGettingSearchedProducts === false) {
                    console.log("pageCounter");
                    hide_ShowMoreBtn();
                    getSearchedProducts(pageNumber + 1);
                    setPageNumber((prev) => prev + 1);
                    setPageCounter((prev) => ({ ...prev, [titlePageSort]: pageCounter[titlePageSort] + 1 }));
                  }
                }
              });
            },
            {
              // rootMargin: "500px",
            }
          );
          observer.observe(lastProduct);
        } else if (
          //
          pageCounter[titlePageSort] > showMoreButtonAfterPages &&
          searchedData[title][titlePageSort]["noMoreProducts"] === false &&
          isGettingSearchedProducts === false
        ) {
          console.log("showing more button");
          show_ShowMoreBtn();
        }
      } else if (searchedData[title][titlePageSort]["noMoreProducts"] === true) {
        show_noMoreProducts();
      }
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [searchedData[title][titlePageSort]]);
  // }, [searchedData[title][titlePageSort], pageCounter[titlePageSort]]);

  useEffect(() => {
    console.log({ totalProductsCount, pageNumber, total: pageNumber * totalProductLength });
    if (pageNumber * totalProductLength >= totalProductsCount && isGettingSearchedProducts === false) {
      console.log("no more data");
      setSearchedData((prev) => ({
        ...prev,
        [title]: {
          ...searchedData[title],
          [titlePageSort]: {
            ...searchedData[title][titlePageSort],
            noMoreProducts: true,
          },
        },
      }));
    }
  }, [pageNumber]);

  useEffect(() => {
    if (searchedData[title][titlePageSort]["noMoreProducts"] === true) {
      show_noMoreProducts();
    } else {
      hide_noMoreProducts();
    }
  }, [searchedData[title][titlePageSort]["noMoreProducts"]]);

  useEffect(() => {
    if (runThisEffectOnce.current === true) {
      runThisEffectOnce.current = false;
      hide_noMoreProducts();
      hide_ShowMoreBtn();
      hideLoader();
    }
  }, []);

  function showMore() {
    // setPageCounter(1);
    setSearchedData((prev) => ({
      ...prev,
      [title]: {
        ...searchedData[title],
        [titlePageSort]: {
          ...searchedData[title][titlePageSort],
          runtime: false,
        },
      },
    }));
    setPageNumber((prev) => prev + 1);
    router.push(`/search?title=${title}&page=${pageNumber + 1}&sortby=${sortby}`);
  }
  //

  return (
    <div ref={mainDivRef} className={displayInGrid === true ? styles.grid : styles.list}>
      <div className={styles.productData}>
        {searchedData.hasOwnProperty(title) && searchedData[title].hasOwnProperty(titlePageSort)
          ? searchedData[title][titlePageSort]["data"].map((element, index) => {
              return (
                <div id={index} key={index} className={cn(styles.product, "allSearchedProducts")}>
                  <div className={styles.image}>
                    <Image src={element.images[0]} width={230} height={230} objectFit="contain" />
                    <button
                      onClick={() => {
                        const heart = document.querySelector(`#heart-${index}`);

                        if (heart.classList.contains(styles.heart_gray)) {
                          // add to heart
                          heart.classList.remove(styles.heart_gray);
                          heart.classList.add(styles.heart_red);
                        } else {
                          // remove from heart
                          heart.classList.remove(styles.heart_red);
                          heart.classList.add(styles.heart_gray);
                        }
                      }}
                      className={styles.heartBtn}
                    >
                      <FaHeart id={`heart-${index}`} className={cn(styles.heart, styles.heart_gray)} />
                    </button>
                  </div>
                  <div className={styles.details}>
                    <div className={styles.title} title={element.title}>
                      {element.title}
                    </div>
                    <div className={styles.price}>US $22.7</div>
                    <div className={styles.sold}>20 Sold</div>
                    <div className={styles.shipping}>Free Shipping</div>
                  </div>
                </div>
              );
            })
          : ""}
      </div>

      <div ref={showMoreBtnDivRef} className={styles.showMore}>
        <button ref={showMoreBtnRef} onClick={showMore}>
          Show More
        </button>
      </div>
      <div ref={loaderRef} className={styles.loader}>
        <div className="lds-dual-ring"></div>
      </div>

      <div ref={noMoreProductsRef} className={styles.showMore}>
        <button disabled={true}>No More Products</button>
      </div>
    </div>
  );
}

export default memo(SearchGrid);
