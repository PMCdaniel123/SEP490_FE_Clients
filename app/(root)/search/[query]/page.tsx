const SearchPage = async ({ params }: { params: { query: string } }) => {
  const decodedQuery = decodeURIComponent(params.query);

  return <div>{decodedQuery}</div>;
};

export default SearchPage;
