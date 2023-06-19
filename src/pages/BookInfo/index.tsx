import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Paper, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import BookIcon from "@mui/icons-material/Book";
import "./style.css";

const BookInfo: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
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
  const link = book.volumeInfo.infoLink || "";

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
  console.log(book);
  return (
    <ThemeProvider theme={theme}>
      <div className="conteiner">
        <div className="favoritosHeader">
          <Link to={`/home?email=${encodeURIComponent(email || "")}`} className="favoritosContentLogo">
            <BookIcon color="primary" className="iconLivro"></BookIcon>
            <p className="titulo">Book Finder</p>
          </Link>
        </div>
        <div className="conteinerInfo">
          <div className="bookInfo">
            <p className="descricao" dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}></p>
            <a className="linkBook" href={link} target="_blank" rel="noopener noreferrer">Ver mais informações</a>
          </div>
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
