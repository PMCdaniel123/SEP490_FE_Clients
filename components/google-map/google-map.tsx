function GoogleMap({ url }: { url: string }) {
  return <div dangerouslySetInnerHTML={{ __html: url }} />;
}

export default GoogleMap;
