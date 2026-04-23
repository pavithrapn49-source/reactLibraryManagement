 const bookImages = {
  "React Guide": "/react guide.jpg",
  "Geographical Tales": "/geo tales.jpg",
  "Harry Potter": "/harry potter.jpg",
  "Java Guide": "/java.jpg",
  "Children's Tales": "/childrens tales.jpg",
  "Lessons of Maths": "/maths.jpg",
  "Little Ones": "/little ones.jpg",
};

export const getBookImage = (title) => {
  const key = Object.keys(bookImages).find(
    (k) => k.toLowerCase() === (title || "").trim().toLowerCase()
  );

  return key ? bookImages[key] : "/default.jpg";
};