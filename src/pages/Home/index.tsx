import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import BookIcon from "@mui/icons-material/Book";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import "./style.css";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { collection, doc, getDocs, setDoc, where, query } from "firebase/firestore";
import { db } from "../../firebase";

export const renderCarousel = (title: string, carouselBooks: any[], handleLike: Function, likedBooks: string[]) => {
  const items = [];

  for (let index = 0; index < carouselBooks.length; index += 5) {
    const carouselItem = (
      <Carousel.Item key={index}>
        <Container>
          <Row>
            <Col xs={12}>
              <h2 className="carouselTitle">{title}</h2>
            </Col>
          </Row>
          <Row>
            {carouselBooks.slice(index, index + 5).map((book) => (
              <Col key={book.id} lg={2} className="contentLivro">
                <img
                  src={
                    book.volumeInfo &&
                      book.volumeInfo.imageLinks &&
                      book.volumeInfo.imageLinks.thumbnail
                      ? book.volumeInfo.imageLinks.thumbnail
                      : "https://via.placeholder.com/150"
                  }
                  alt={book.volumeInfo.title}
                  className="imgLivro"
                />
                <h4 className="tituloLivro">{book.volumeInfo.title}</h4>
                <div className="botoesLivro">
                  <button
                    className={`botaoLikeLivro ${likedBooks.includes(book.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(book.id)}
                  >
                    {likedBooks.includes(book.id) ? (
                      <FavoriteIcon className="iconeLikeLivro" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </button>

                  <Link
                    to={`/bookinfo/${book.id}`}
                    className="linkInformacaoLivro"
                  >
                    Ver mais
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </Carousel.Item>
    );

    items.push(carouselItem);
  }

  return (
    <Carousel indicators={false} interval={null} className="carouselLivros">
      {items}
    </Carousel>
  );
};


const Home: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [querySearch, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [romanceBooks, setRomanceBooks] = useState<any[]>([]);
  const [fictionBooks, setFictionBooks] = useState<any[]>([]);
  const [terrorBooks, setTerrorBooks] = useState<any[]>([]);
  const [likedBooks, setLikedBooks] = useState<string[]>([]);

  const searchBooks = async (querySearch: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${querySearch}&maxResults=20`
      );
      return response.data.items;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newBooks = await searchBooks(querySearch);
    setSearchResults(newBooks);
  };

  const handleLike = async (bookId: string) => {
    if (email) {
      try {
        const updatedLikedBooks = likedBooks.includes(bookId)
          ? likedBooks.filter((id) => id !== bookId)
          : [...likedBooks, bookId];
        setLikedBooks(updatedLikedBooks);

        if (email) {
          const usersCollection = collection(db, "users");
          const querySnapshot = await getDocs(query(usersCollection, where("login", "==", email)));

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await setDoc(userDoc.ref, { favoritos: updatedLikedBooks }, { merge: true });
            console.log("Liked books updated");
          }
        }
      } catch (error) {
        console.error("Error updating liked books:", error);
      }
    }
  };



  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffff",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  useEffect(() => {
    const fetchTerrorBooks = async () => {
      const terrorBooks = await searchBooks("livros de terror");
      setTerrorBooks(terrorBooks);
    };

    fetchTerrorBooks();

    const fetchFictionBooks = async () => {
      const fictionBooks = await searchBooks("livros de ficção");
      setFictionBooks(fictionBooks);
    };

    fetchFictionBooks();

    const fetchRomanceBooks = async () => {
      const romanceBooks = await searchBooks("livros de romance");
      setRomanceBooks(romanceBooks);
    };

    fetchRomanceBooks();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchLikedBooks = async () => {
        try {
          const usersCollection = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersCollection, where("login", "==", email))
          );

          if (!querySnapshot.empty) {
            querySnapshot.forEach((document) => {
              const favoritos = document.data().favoritos;
              if (favoritos && Array.isArray(favoritos)) {
                setLikedBooks(favoritos);
                console.log(favoritos);
              }
            });
          } else {
            console.log("Usuário não encontrado");
          }
        } catch (error) {
          console.error("Error fetching liked books:", error);
        }
      };

      fetchLikedBooks();
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      const updateLikedBooks = async () => {
        try {
          const userRef = doc(db, "users", email);
          await setDoc(userRef, { favoritos: likedBooks }, { merge: true });
          console.log("Liked books updated");
          console.log(likedBooks);
        } catch (error) {
          console.error("Error updating liked books:", error);
        }
      };

      if (likedBooks.length > 0) {
        updateLikedBooks();
      }
    }
  }, [email, likedBooks]);

  return (
    <ThemeProvider theme={theme}>
      <div className="conteiner">
        <div className="contentBusca">
          <div className="contentLogoTitulo">
            <BookIcon color="primary" className="iconLivro"></BookIcon>
            <h1 className="titulo">Book Finder</h1>
          </div>
          <Paper
            className="pesquisa"
            component="form"
            sx={{
              p: "1px 2px",
              display: "flex",
              alignItems: "center",
              width: 300,
            }}
            onSubmit={handleFormSubmit}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              type="text"
              value={querySearch}
              placeholder="Busque pelo nome do livro"
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>

          <Link
            to={`/favoritos?email=${encodeURIComponent(email || "")}`}
            className="linkFavoritos"
          >
            Meus Favoritos
          </Link>
        </div>
        {searchResults.length > 0 &&
          renderCarousel(
            "Resultados da pesquisa",
            searchResults,
            handleLike,
            likedBooks
          )}
        {renderCarousel("Mais Vendidos Ficção", fictionBooks, handleLike, likedBooks)}
        {renderCarousel("Mais Vendidos Romance", romanceBooks, handleLike, likedBooks)}
        {renderCarousel("Mais Vendidos Terror", terrorBooks, handleLike, likedBooks)}
      </div>
    </ThemeProvider>
  );
};

export default Home;
