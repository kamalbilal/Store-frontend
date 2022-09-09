// import Search from "../components/Search/Search";
import { SearchedPageData_context, SearchPageNumber_context, SearchUrlHistory_context } from "../userContext";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/router";
import SearchMain from "../components/Search/SearchMain";
import SearchLeft from "../components/Search/SearchLeft/SearchLeft";

function search({ urlTitle, urlPage, data, count, sort }) {
  const router = useRouter();
  const totalProductLength = 10;
  const [totalProductsCount, setTotalProductsCount] = useState(count);
  const [title, setTitle] = useState(urlTitle);
  const [page, setPage] = useState(urlPage);
  const [titlePageSort, setTitlePageSort] = useState(`${title}_${urlPage}_${sort}`);
  const [sortby, setSortby] = useState(`${title}_${urlPage}`);
  const [pageCounter, setPageCounter] = useState({});
  const [displayInGrid, setDisplayInGrid] = useState(true);

  const { searchedData, setSearchedData } = useContext(SearchedPageData_context);
  const { pageNumber, setPageNumber } = useContext(SearchPageNumber_context);
  const { searchUrlHistory, setSearchUrlHistory } = useContext(SearchUrlHistory_context);

  useEffect(() => {
    const currentPage = isNaN(router.query.page) ? "" : router.query.page * 1;
    const currentSort = router.query.sortby;
    const title = router.query.title;
    const titlePageSort = `${title}_${currentPage}_${currentSort}`;
    console.log(titlePageSort);
    setTitlePageSort(titlePageSort);
    setTitle(router.query.title);
    setPage(router.query.page);
    setSortby(router.query.sortby);

    const urlPath = router.asPath;
    console.log(router);
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
        [title]: { ...searchedData[title], [titlePageSort]: { runtime: true, noMoreProducts: false, data } },
      }));
      setPageNumber(isNaN(page) ? 1 : 1 * page);
    } else if (!searchedData[title].hasOwnProperty(titlePageSort)) {
      setSearchedData((prev) => ({
        ...prev,
        [title]: { ...searchedData[title], [titlePageSort]: { runtime: true, noMoreProducts: false, data } },
      }));
      // setPageNumber(isNaN(page) ? 1 : 1 * urlPage);
    } else {
      console.log("setting previous data");
      console.log({ titlePageSort });
      if (searchedData.hasOwnProperty(title) && searchedData[title].hasOwnProperty(titlePageSort)) {
        goBack();
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    setPageNumber(isNaN(page) ? 1 : 1 * page);
  }, []);

  useEffect(() => {
    if (titlePageSort && !pageCounter.hasOwnProperty(titlePageSort)) {
      setPageCounter((prev) => ({ ...prev, [titlePageSort]: 1 }));
    }
  }, [titlePageSort]);

  function goBack() {
    console.log("goback Called");
    const current = location.href;
    let currentPage = current.split("page=")[1].split("&")[0];
    currentPage = isNaN(currentPage) ? "" : currentPage * 1;

    const title = current.split("title=")[1].split("&")[0];
    const currentPageIndex = searchUrlHistory[title]["pages"].indexOf(String(currentPage));

    let totalProductsCount = 0;
    let keys = Object.keys(searchedData[title]);
    console.log(keys);
    for (let index = 0; index <= currentPageIndex; index++) {
      totalProductsCount += searchedData[title][keys[index]]["data"].length;
    }
    setPageNumber(parseInt(totalProductsCount / totalProductLength));
  }

  useEffect(() => {
    window.addEventListener("popstate", goBack);
    return () => {
      window.removeEventListener("popstate", goBack);
    };
  }, [searchUrlHistory, router.asPath]);

  useEffect(() => {
    console.log("pagenumber: " + pageNumber);
  }, [pageNumber]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20% auto", gap: "10px" }}>
      <div>
        <SearchLeft pageNumber={pageNumber} pageCounter={pageCounter} searchedData={searchedData} title={title} />
      </div>
      {searchedData.hasOwnProperty(title) &&
      searchedData[title].hasOwnProperty(titlePageSort) &&
      searchedData[title][titlePageSort]["data"].length > 0 ? (
        <SearchMain
          data={{ searchedData, setSearchedData }}
          totalProductsCount={totalProductsCount}
          title={title}
          titlePageSort={titlePageSort}
          page={page}
          pageNumberState={{ pageNumber, setPageNumber }}
          pageCounterState={{ pageCounter, setPageCounter }}
          router={router}
          displayIn={{ displayInGrid, setDisplayInGrid }}
          totalProductLength={totalProductLength}
          sortby={sortby}
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
  let { sortby } = query;

  if (!title) {
    return {
      notFound: true,
    };
  }
  if (!page) {
    page = 1;
  }
  if (!sortby) {
    sortby = "bestMatch";
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
    props: { urlTitle: title, urlPage: page, data, count, sort: sortby },
  };
}

export default memo(search);
