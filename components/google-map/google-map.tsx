function GoogleMap() {
  const nvhEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d348.9642206394354!2d106.79814839250291!3d10.87513123723215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2sNh%C3%A0%20V%C4%83n%20h%C3%B3a%20Sinh%20vi%C3%AAn%20TP.HCM!5e0!3m2!1sen!2sau!4v1697048597389!5m2!1sen!2sau";

  return (
    <div>
      <iframe
        src={nvhEmbedUrl}
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
