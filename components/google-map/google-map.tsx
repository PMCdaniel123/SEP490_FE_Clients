function GoogleMap({ url }: { url: string }) {
  return (
    <iframe
      src={url.match(/src="([^"]+)"/)?.[1]}
      width="100%"
      height="400px"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

export default GoogleMap;
