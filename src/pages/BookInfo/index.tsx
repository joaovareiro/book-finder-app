import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Paper, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import BookIcon from "@mui/icons-material/Book";
import "./style.css";

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
  const authors = book.volumeInfo.authors || "";

  const sanitizeHTML = (htmlString: string) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.innerHTML;
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffff", // cor primária
      },
      secondary: {
        main: "#f50057", // cor secundária
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="conteiner">
        <div className="contentBusca">
          <div className="contentLogoTitulo">
            <BookIcon color="primary" className="iconLivro"></BookIcon>
            <h1 className="titulo">Book Finder</h1>
          </div>
        </div>
        <div className="conteinerInfo">
          <p className="descricao" dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}></p>
          <div className="cardBook">
            <p className="tituloLivro">{title}</p>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
              className="imgbook"
            />
            <p className="autores" dangerouslySetInnerHTML={{ __html: sanitizeHTML(authors) }}></p>
          </div>
        </div>
      </div>

    </ThemeProvider>
  );
};

export default BookInfo;
