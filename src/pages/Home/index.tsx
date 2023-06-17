import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import BookIcon from "@mui/icons-material/Book";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import "./style.css";
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';


const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [romanceBooks, setRomanceBooks] = useState<any[]>([]);
  const [fictionBooks, setFictionBooks] = useState<any[]>([]);
  const [terrorBooks, setTerrorBooks] = useState<any[]>([]);


  const searchBooks = async (query: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
      );
      return response.data.items;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newBooks = await searchBooks(query);
    setSearchResults(newBooks);
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
  const renderCarousel = (title: string, carouselBooks: any[]) => (
    <Carousel indicators={false} interval={null} className="carouselLivros">
      {carouselBooks.map((book, index) => (
        index % 5 === 0 && (
          <Carousel.Item key={index}>
            <Container>
              <Row>
                <Col xs={12}>
                  <h2 className="carouselTitle">{title}</h2>
                </Col>
              </Row>
              <Row>
                {carouselBooks.slice(index, index + 5).map((book) => (
                  <Col key={book.id} xs={12} sm={6} md={4} lg={2} className="contentLivro">
                    <img
                      src={book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150"}
                      alt={book.volumeInfo.title}
                      className="imgLivro"
                    />
                    <h4 className="tituloLivro">{book.volumeInfo.title}</h4>
                    <Link to={`/bookinfo/${book.id}`} className="linkInformacaoLivro">
                      Ver mais
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          </Carousel.Item>
        )
      ))}
    </Carousel>
  );


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
              value={query}
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
        </div>
        {searchResults.length > 0 && renderCarousel("Resultados da pesquisa", searchResults)}
        {renderCarousel("Mais Vendidos Ficção", fictionBooks)}
        {renderCarousel("Mais Vendidos Romance", romanceBooks)}
        {renderCarousel("Mais Vendidos Terror", terrorBooks)}


      </div>
    </ThemeProvider>
  );
};

export default Home;
