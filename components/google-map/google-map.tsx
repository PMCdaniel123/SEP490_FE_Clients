function GoogleMap({ url }: { url: string }) {
  let match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

  if (!match) {
    match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  }

  const coordinates = match
    ? `${match[1]},${match[2]}`
    : "10.8409254,106.7975011";

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=${coordinates}`;

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="400px"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

export default GoogleMap;
