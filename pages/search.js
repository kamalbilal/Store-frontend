// import Search from "../components/Search/Search";
import { SearchedPageData_context, SearchPageNumber_context, SearchUrlHistory_context } from "../userContext";
import { useContext, useEffect, useState, useRef, memo } from "react";
import { useRouter } from "next/router";
import SearchMain from "../components/Search/SearchMain";
import SearchLeft from "../components/Search/SearchLeft/SearchLeft";

function search({ urlTitle, urlPage, data, count, sort }) {
  const router = useRouter();

  const [title, setTitle] = useState(urlTitle);
  const [page, setPage] = useState(urlPage);
  const [sortby, setSortby] = useState(sort);
  const [titlePageSort, setTitlePageSort] = useState(`${urlTitle}-${urlPage}-${sort}`);
  const [titleSort, setTitleSort] = useState(`${urlTitle}-${sort}`);

  const { searchedData, setSearchedData } = useContext(SearchedPageData_context);
  // const { pageNumber, setPageNumber } = useContext(SearchPageNumber_context);
  const { searchUrlHistory, setSearchUrlHistory } = useContext(SearchUrlHistory_context);

  function returnParams(url) {
    const tempObject = {};
    url = url.split("?")[1];
    if (url.includes("&")) {
      url = url.split("&");
    }
    url.forEach((element) => {
      const key = element.split("=")[0];
      const value = element.split("=")[1];
      tempObject[key] = value;
    });
    return tempObject;
  }

  useEffect(() => {
    const handleRouteChange = (url) => {
      const params = returnParams(url);
      setTitle(params.title);
      setPage(params.page);
      setSortby(params.sortby);
      setTitlePageSort(`${params.title}-${params.page}-${params.sortby}`);
      setTitleSort(`${params.title}-${params.sortby}`);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    console.count("one");
    setSearchUrlHistory((prev) => {
      if (prev.hasOwnProperty(titleSort)) {
        const exist = prev[titleSort].indexOf(page);
        if (exist > -1) {
          prev[titleSort].splice(exist, exist);
        }
        return { ...prev, [titleSort]: [page, ...prev[titleSort]] };
      } else {
        return { ...prev, [titleSort]: [page] };
      }
    });
  }, [titleSort, page]);

  useEffect(() => {
    if (Object.keys(searchUrlHistory).length === 0) return;
    console.count("two");
    console.log(searchUrlHistory);
    setSearchedData((prev) => {
      if (prev.hasOwnProperty(titlePageSort)) {
        return { ...prev, [titlePageSort]: [...prev[titlePageSort], ...data] };
      } else {
        return { ...prev, [titlePageSort]: [...data] };
      }
    });
  }, [searchUrlHistory]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "20% auto", gap: "10px" }}>
      <div>{/* <SearchLeft pageNumber={pageNumber} pageCounter={pageCounter} searchedData={searchedData} title={title} /> */}</div>

      <SearchMain
      //  data={{ searchedData, setSearchedData }}
      />
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
