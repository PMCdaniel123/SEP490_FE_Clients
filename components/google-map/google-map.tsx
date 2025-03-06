function GoogleMap({ url }: { url: string }) {

  return (
    <div>
      <iframe
        src={url}
        width="100%"
        height="400px"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
}

export default GoogleMap;
