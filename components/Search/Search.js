import styles from "./Search.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Search({ title, page }) {
  const [searchedData, setSearchedData] = useState();
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
        pwd: "Kamal",
      },
    };

    const response = await axios(options).catch((error) => console.log(error));
    if (!response) return console.log("response error");
    if (response.data.success === true) {
      setSearchedData(response.data.products);
    }
  }

  useEffect(() => {
    getSearchedProducts();
  }, []);
  useEffect(() => {
    console.log(searchedData);
  }, [searchedData]);

  return (
    <div className={styles.body}>
      <div>left</div>
      <div>Products</div>
    </div>
  );
}

export default Search;
