import Search from "../components/Search/Search";

function search({ title, page }) {
  return (
    <div>
      <Search title={title} page={page} />
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

  return {
    props: { title, page },
  };
}

export default search;
