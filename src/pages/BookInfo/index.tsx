import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        setBook(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookInfo();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const title = book.volumeInfo.title || "";
  const description = book.volumeInfo.description || "";

  const sanitizeHTML = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.innerHTML;
  };

  return (
    <div>
      <h2>{title}</h2>
      <img
        src={book.volumeInfo.imageLinks?.thumbnail}
        alt={book.volumeInfo.title}
        className="imgLivro"
      />
      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}></div>
    </div>
  );
};

export default BookInfo;
