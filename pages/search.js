// import Search from "../components/Search/Search";
import { SearchedPageData_context, SearchPageNumber_context, SearchUrlHistory_context } from "../userContext";
import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import SearchMain from "../components/Search/SearchMain";

function search({ urlTitle, urlPage, data }) {
  const router = useRouter();
  const totalProductLength = 10;
  const [title, setTitle] = useState(urlTitle);
  const [page, setPage] = useState(urlPage);
  const [titlePage, setTitlePage] = useState(`${title}_${urlPage}`);
  const [pageCounter, setPageCounter] = useState();
  const [displayInGrid, setDisplayInGrid] = useState(true);

  const { searchedData, setSearchedData } = useContext(SearchedPageData_context);
  const { pageNumber, setPageNumber } = useContext(SearchPageNumber_context);
  const { searchUrlHistory, setSearchUrlHistory } = useContext(SearchUrlHistory_context);

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
        [title]: { ...searchedData[title], [titlePage]: { runtime: true, data } },
      }));
      setPageNumber(isNaN(page) ? 1 : 1 * page);
    } else if (!searchedData[title].hasOwnProperty(titlePage)) {
      console.log("runngnnnnnn");
      setSearchedData((prev) => ({
        ...prev,
        [title]: { ...searchedData[title], [titlePage]: { runtime: true, data } },
      }));
      // setPageNumber(isNaN(page) ? 1 : 1 * urlPage);
    } else {
      console.log("setting previous data");
    }
  }, [router.asPath]);

  useEffect(() => {
    console.log("running useeffect");
    setPageNumber(isNaN(page) ? 1 : 1 * page);
  }, []);

  useEffect(() => {
    if (titlePage) {
      setPageCounter((prev) => ({ ...prev, [titlePage]: 1 }));
    }
  }, [titlePage]);

  useEffect(() => {
    console.log({ searchedData });
  }, [searchedData]);
  useEffect(() => {
    console.log({ searchUrlHistory });
  }, [searchUrlHistory]);

  function goBack() {
    // let isBack = false;
    const current = location.href;

    let currentPage = current.split("page=")[1];
    currentPage = isNaN(currentPage) ? "" : currentPage * 1;

    // const previousPage = isNaN(router.query.page) ? "" : router.query.page * 1;

    // if (previousPage > currentPage) {
    //   isBack = true;
    // }

    // const titlePage = `${title}_${currentPage}`;
    const currentPageIndex = searchUrlHistory[title]["pages"].indexOf(String(currentPage));
    console.log({ index: searchUrlHistory[title]["pages"].indexOf(String(currentPage)) });
    let totalProductsCount = 0;
    let keys = Object.keys(searchedData[title]);
    for (let index = 0; index <= currentPageIndex; index++) {
      totalProductsCount += searchedData[title][keys[index]]["data"].length;
    }
    console.log(totalProductsCount);
    setPageNumber(parseInt(totalProductsCount / totalProductLength));
    // if (isBack) {
    // console.log(searchedData);
    // const currentPageDataLength = searchedData[title][titlePage]["data"].length;
    // const number = parseInt(currentPageDataLength / totalProductLength);
    // setPageNumber(number);
    // } else {
    // setPageNumber((prev) => prev + 1);
    // }
  }

  useEffect(() => {
    window.addEventListener("popstate", goBack);
    return () => {
      window.removeEventListener("popstate", goBack);
    };
  }, [pageNumber, searchUrlHistory, router]);

  useEffect(() => {
    console.log("pagenumber: " + pageNumber);
  }, [pageNumber]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20% auto" }}>
      <div>
        left
        <button onClick={() => console.log({ searchedData, pageNumber, titlePage })} style={{ position: "fixed" }}>
          button
        </button>
      </div>
      {searchedData.hasOwnProperty(title) && searchedData[title].hasOwnProperty(titlePage) ? (
        <SearchMain
          data={{ searchedData, setSearchedData }}
          title={title}
          titlePage={titlePage}
          page={page}
          pageNumberState={{ pageNumber, setPageNumber }}
          pageCounterState={{ pageCounter, setPageCounter }}
          router={router}
          displayIn={{ displayInGrid, setDisplayInGrid }}
        />
      ) : (
        "not"
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
    body: JSON.stringify({ pageNumber: page, title }),
  });
  response = await response.json();

  const data = response.products;

  return {
    props: { urlTitle: title, urlPage: page, data },
  };
}

export default search;
