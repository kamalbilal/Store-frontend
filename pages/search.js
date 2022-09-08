// import Search from "../components/Search/Search";
import { SearchedPageData_context, SearchPageNumber_context, SearchUrlHistory_context } from "../userContext";
import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import SearchMain from "../components/Search/SearchMain";
import SearchLeft from "../components/Search/SearchLeft/SearchLeft";

function search({ urlTitle, urlPage, data, count }) {
  const router = useRouter();
  const totalProductLength = 10;
  const [totalProductsCount, setTotalProductsCount] = useState(count);
  const [title, setTitle] = useState(urlTitle);
  const [page, setPage] = useState(urlPage);
  const [titlePage, setTitlePage] = useState(`${title}_${urlPage}`);
  const [pageCounter, setPageCounter] = useState({});
  const [displayInGrid, setDisplayInGrid] = useState(true);

  const { searchedData, setSearchedData } = useContext(SearchedPageData_context);
  const { pageNumber, setPageNumber } = useContext(SearchPageNumber_context);
  const { searchUrlHistory, setSearchUrlHistory } = useContext(SearchUrlHistory_context);

  useEffect(() => {
    console.log(totalProductsCount);
  }, [totalProductsCount]);

  useEffect(() => {
    const currentPage = isNaN(router.query.page) ? "" : router.query.page * 1;
    const titlePage = `${title}_${currentPage}`;
    console.log(titlePage);
    setTitlePage(titlePage);
    setTitle(router.query.title);
    setPage(router.query.page);

    const urlPath = router.asPath;
    if (!searchUrlHistory.hasOwnProperty(title)) {
      setSearchUrlHistory((prev) => ({
        ...prev,
        [title]: { pages: [router.query.page] },
      }));
    } else if (!searchUrlHistory[title]["pages"].includes(router.query.page)) {
      setSearchUrlHistory((prev) => ({
        ...prev,
        [title]: { pages: [...searchUrlHistory[title]["pages"], router.query.page] },
      }));
    }

    if (!searchedData.hasOwnProperty(title)) {
      console.log("setting new data");
      setSearchedData((prev) => ({
        ...prev,
        [title]: { ...searchedData[title], [titlePage]: { runtime: true, noMoreProducts: false, data } },
      }));
      setPageNumber(isNaN(page) ? 1 : 1 * page);
    } else if (!searchedData[title].hasOwnProperty(titlePage)) {
      setSearchedData((prev) => ({
        ...prev,
        [title]: { ...searchedData[title], [titlePage]: { runtime: true, noMoreProducts: false, data } },
      }));
      // setPageNumber(isNaN(page) ? 1 : 1 * urlPage);
    } else {
      console.log("setting previous data");
    }
  }, [router.asPath, title]);

  useEffect(() => {
    console.log(searchedData);
  }, [searchedData]);

  useEffect(() => {
    setPageNumber(isNaN(page) ? 1 : 1 * page);
  }, []);

  useEffect(() => {
    if (titlePage && !pageCounter.hasOwnProperty(titlePage)) {
      setPageCounter((prev) => ({ ...prev, [titlePage]: 1 }));
    }
  }, [titlePage]);

  function goBack() {
    console.log("goback Called");
    const current = location.href;
    console.log(searchUrlHistory);
    let currentPage = current.split("page=")[1];
    currentPage = isNaN(currentPage) ? "" : currentPage * 1;

    const title = current.split("title=")[1].split("&")[0];
    console.log(title);
    console.log(searchUrlHistory[title]["pages"]);
    console.log(currentPage);
    const currentPageIndex = searchUrlHistory[title]["pages"].indexOf(String(currentPage));
    console.log(searchUrlHistory[title]["pages"].indexOf(String(currentPage)));
    let totalProductsCount = 0;
    let keys = Object.keys(searchedData[title]);
    console.log(keys);
    for (let index = 0; index <= currentPageIndex; index++) {
      totalProductsCount += searchedData[title][keys[index]]["data"].length;
    }
    console.log(parseInt(totalProductsCount / totalProductLength));
    setPageNumber(parseInt(totalProductsCount / totalProductLength));
  }

  useEffect(() => {
    window.addEventListener("popstate", goBack);
    return () => {
      window.removeEventListener("popstate", goBack);
    };
  }, [pageNumber, searchUrlHistory, router.asPath, title]);

  useEffect(() => {
    console.log("pagenumber: " + pageNumber);
  }, [pageNumber]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20% auto", gap: "10px" }}>
      <div>
        <SearchLeft pageNumber={pageNumber} pageCounter={pageCounter} searchedData={searchedData} title={title} />
      </div>
      {searchedData.hasOwnProperty(title) &&
      searchedData[title].hasOwnProperty(titlePage) &&
      searchedData[title][titlePage]["data"].length > 0 ? (
        <SearchMain
          data={{ searchedData, setSearchedData }}
          totalProductsCount={totalProductsCount}
          title={title}
          titlePage={titlePage}
          page={page}
          pageNumberState={{ pageNumber, setPageNumber }}
          pageCounterState={{ pageCounter, setPageCounter }}
          router={router}
          displayIn={{ displayInGrid, setDisplayInGrid }}
          totalProductLength={totalProductLength}
        />
      ) : (
        "not Found any product"
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const { title } = query;
  let { page } = query;

  if (!title) {
    return {
      notFound: true,
    };
  }
  if (!page) {
    page = 1;
  }
  let response = await fetch(`http://localhost:8000/getsearchedproducts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageNumber: page, title, isServer: true }),
  });
  response = await response.json();

  const data = response.products;
  const count = response.count;

  return {
    props: { urlTitle: title, urlPage: page, data, count },
  };
}

export default search;
