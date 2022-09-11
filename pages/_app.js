import "../styles/globals.css";
import styles from "./index.module.css";
import Navbar from "../components/Desktop/NavBar/Navbar";
import Footer from "../components/Desktop/Footer/Footer";
import {
  CartContext,
  GiftContext,
  HeartContext,
  VisitedLinksArray,
  AdminPageData_context,
  ModifyOfferData_context,
  InsertOfferData_context,
  ModifyDefaultInputValues_context,
  InsertDefaultInputValues_context,
  InsertOfferDataCount_context,
  SearchedPageData_context,
  SearchPageNumber_context,
  SearchPageNumberHistory_context,
} from "../userContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [cartNumber, setCartNumber] = useState({
    count: 0,
    ids: [],
  }); // dafault value
  const [giftNumber, setGiftNumber] = useState({ count: 0 }); // dafault value
  const [heartNumber, setHeartNumber] = useState({ count: 0 }); // dafault value
  const [visitedLinksArray, setVisitedLinksArray] = useState([]); // dafault value
  const [adminPageData, setAdminPageData] = useState(null); // dafault value
  const [modifyOfferData, setModifyOfferData] = useState(null); // dafault value
  const [insertOfferData, setInsertOfferData] = useState(null); // dafault value
  const [modifyDefaultInputValues, setModifyDefaultInputValues] = useState(null); // dafault value
  const [insertDefaultInputValues, setInsertDefaultInputValues] = useState(null); // dafault value
  const [totalCount, setTotalCount] = useState(null); // dafault value
  const [searchedData, setSearchedData] = useState({}); // dafault value
  const [pageNumber, setPageNumber] = useState(0); // dafault value
  const [searchPageNumberHistory, setSearchPageNumberHistory] = useState({}); // dafault value

  const router = useRouter();
  const forbiddenLinks = ["/register", "/login", "/register/authentication", "/login/authentication"];

  useEffect(() => {
    if (forbiddenLinks.includes(router.pathname)) {
      return;
    }
    let tempArray = visitedLinksArray;
    if (!tempArray.includes(router.pathname)) {
      tempArray.push(router.pathname);
      setVisitedLinksArray(tempArray);
    } else {
      tempArray = tempArray.filter((e) => e !== router.pathname);
      tempArray.push(router.pathname);
      setVisitedLinksArray(tempArray);
    }
  }, [router]);

  useEffect(() => {
    console.log(visitedLinksArray);
  }, [visitedLinksArray, router]);

  function app(path) {
    if (path.includes("/admin/")) {
      return (
        <InsertOfferDataCount_context.Provider value={{ totalCount, setTotalCount }}>
          <InsertOfferData_context.Provider value={{ insertOfferData, setInsertOfferData }}>
            <InsertDefaultInputValues_context.Provider value={{ insertDefaultInputValues, setInsertDefaultInputValues }}>
              <ModifyDefaultInputValues_context.Provider value={{ modifyDefaultInputValues, setModifyDefaultInputValues }}>
                <ModifyOfferData_context.Provider value={{ modifyOfferData, setModifyOfferData }}>
                  <AdminPageData_context.Provider value={{ adminPageData, setAdminPageData }}>
                    <Component {...pageProps} />
                  </AdminPageData_context.Provider>
                </ModifyOfferData_context.Provider>
              </ModifyDefaultInputValues_context.Provider>
            </InsertDefaultInputValues_context.Provider>
          </InsertOfferData_context.Provider>
        </InsertOfferDataCount_context.Provider>
      );
    } else {
      return (
        <SearchPageNumberHistory_context.Provider value={{ searchPageNumberHistory, setSearchPageNumberHistory }}>
          <SearchPageNumber_context.Provider value={{ pageNumber, setPageNumber }}>
            <SearchedPageData_context.Provider value={{ searchedData, setSearchedData }}>
              <VisitedLinksArray.Provider value={{ visitedLinksArray, setVisitedLinksArray }}>
                <HeartContext.Provider value={{ heartNumber, setHeartNumber }}>
                  <GiftContext.Provider value={{ giftNumber, setGiftNumber }}>
                    <CartContext.Provider value={{ cartNumber, setCartNumber }}>
                      <div className={styles.navBar}>
                        <Navbar />
                      </div>
                      <div className={styles.content}>
                        <Component {...pageProps} />
                      </div>
                      <Footer />
                    </CartContext.Provider>
                  </GiftContext.Provider>
                </HeartContext.Provider>
              </VisitedLinksArray.Provider>
            </SearchedPageData_context.Provider>
          </SearchPageNumber_context.Provider>
        </SearchPageNumberHistory_context.Provider>
      );
    }
  }
  return <>{app(router.pathname)}</>;
}

export default MyApp;
