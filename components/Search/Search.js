import styles from "./Search.module.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import cn from "classnames";

function Search({ title, page }) {
  const [searchedData, setSearchedData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const useEffectRun_ref = useRef(true);

  async function getSearchedProducts() {
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
        pageNumber: pageNumber,
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    if (!response) return console.log("response error");
    if (response.data.success === true) {
      console.log(pageNumber);
      console.log(response.data);
      if (response.data.products.length > 0) {
        setSearchedData((prev) => [...prev, ...response.data.products]);
      }
    }
  }

  useEffect(() => {
    getSearchedProducts();
  }, [pageNumber]);

  useEffect(() => {
    console.log(searchedData);
  }, [searchedData]);

  useEffect(() => {
    if (searchedData.length > 0) {
      const allProducts = document.querySelectorAll(".allSearchedProducts");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
            } else {
              entry.target.classList.remove("show");
            }
          });
        },
        {
          rootMargin: "200px",
        }
      );

      allProducts.forEach((element) => {
        observer.observe(element);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [searchedData]);

  useEffect(() => {
    if (searchedData.length > 0) {
      const lastProduct = document.querySelector(".allSearchedProducts:last-of-type");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("is Showing");
              setPageNumber((prev) => prev + 1);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "500px",
        }
      );

      observer.observe(lastProduct);

      return () => {
        observer.disconnect();
      };
    }
  }, [searchedData]);

  function test(params) {
    setSearchedData((prev) => [...prev, ...searchedData, ...searchedData]);
  }

  return (
    <div className={styles.body}>
      <div>
        left
        <button onClick={test} style={{ position: "fixed" }}>
          button
        </button>
      </div>
      <div>
        {searchedData.length > 0 ? (
          <div className={styles.productData}>
            {searchedData.map((element, index) => {
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
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Search;
