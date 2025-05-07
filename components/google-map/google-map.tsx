function GoogleMap({ url }: { url: string }) {
  let coordinates = "";
  let placeName = "";

  // Extract coordinates from URL
  // Try format: @10.7778689,106.6930648
  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    coordinates = `${coordMatch[1]},${coordMatch[2]}`;
  }

  // Try !3d!4d format as fallback
  if (!coordinates) {
    const altCoordMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (altCoordMatch) {
      coordinates = `${altCoordMatch[1]},${altCoordMatch[2]}`;
    }
  }

  // Extract place name from URL
  // Format: /place/Toong+-+coworking+space/
  const nameMatch = url.match(/place\/([^/@]+)/);
  if (nameMatch) {
    placeName = nameMatch[1].replace(/\+/g, " ");
  }

  // Extract place ID if available
  let placeId = null;
  const placeIdMatch = url.match(/0x[0-9a-f]+:0x[0-9a-f]+/);
  if (placeIdMatch) {
    placeId = placeIdMatch[0];
  }

  // Determine what to use for the embed URL
  let embedUrl;

  // If we have both coordinates and name, use them together for precision
  if (coordinates && placeName) {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=${encodeURIComponent(
      placeName
    )}&center=${coordinates}&zoom=17`;
  }
  // If only coordinates are available
  else if (coordinates) {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=${coordinates}`;
  }
  // If place ID is available
  else if (placeId) {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=place_id:${placeId}`;
  }
  // If only place name is available
  else if (placeName) {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=${encodeURIComponent(
      placeName
    )}`;
  }
  // Default fallback
  else {
    embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAHYXQ7H8v3vHC2HocjzPUfuLKrwnAaya4&q=10.8409254,106.7975011`;
  }

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
