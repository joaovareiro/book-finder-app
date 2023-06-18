import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from '../../firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import axios from "axios";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./style.css";
import BookIcon from "@mui/icons-material/Book";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Paper } from '@mui/material';

const LikePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || '';
  const password = queryParams.get('password') || '';
  const [carouselBooks, setCarouselBooks] = useState<any[]>([]);
  const [likedBooks, setLikedBooks] = useState<string[]>([]);

  useEffect(() => {
    coletarFavoritos(email);
  }, []);

  const handleLike = (bookId: string) => {
    if (likedBooks.includes(bookId)) {
      setLikedBooks(likedBooks.filter((id: string) => id !== bookId));
    } else {
      setLikedBooks([...likedBooks, bookId]);
    }
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

  const isBookLiked = (bookId: string) => {
    return likedBooks.includes(bookId);
  };

  const searchBook = async (id: string) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const collectBookList = async (lista: any[]) => {
    try {
      const bookPromisses = lista.map(async (nome) => {
        const resposta = await searchBook(nome);
        return resposta;
      });
      const books = await Promise.all(bookPromisses);
      setCarouselBooks(books);
    } catch (error) {
      console.error(error);
    }
  };

  const coletarFavoritos = async (email: string) => {
    const usersCollection = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersCollection, where('login', '==', email)));
    if (!querySnapshot.empty) {
      querySnapshot.forEach((document) => {
        const favoritos = document.data().favoritos;
        if (favoritos && Array.isArray(favoritos)) {
          collectBookList(favoritos);
        }
      });
    } else {
      console.log('Usuário não encontrado');
    }
  };

  const renderCarousel = (carouselBooks: any[]) => (
    <Carousel indicators={false} interval={null} className="carouselLivros">
      {carouselBooks.map((book, index) => (
        index % 5 === 0 && (
          <Carousel.Item key={index}>
            <Container>
              <Row>
                <Col xs={12}>
                  <h2 className="Favoritos">Favoritos</h2>
                </Col>
              </Row>
              <Row>
                {carouselBooks.slice(index, index + 5).map((book) => (
                  <Col key={book.id} lg={2} className="contentLivro">
                    <img
                      src={book.volumeInfo && book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150"}
                      alt={book.volumeInfo.title}
                      className="imgLivro"
                    />
                    <h4 className="tituloLivro">{book.volumeInfo.title}</h4>
                    <div className="botoesLivro">
                      <button className="botaoLikeLivro" onClick={() => handleLike(book.id)}>
                        {isBookLiked(book.id) ? (
                          <FavoriteIcon className="iconeLikeLivro" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </button>
                      <Link to={`/bookinfo/${book.id}`} className="linkInformacaoLivro">
                        Ver mais
                      </Link>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </Carousel.Item>
        )
      ))}
    </Carousel>
  );
  
  const goToHome = () =>{
    const queryParams = `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    navigate(`/home${queryParams}`);
  };

  return (
    <ThemeProvider theme={theme}>
     <div className="conteiner">
        <div className="contentBusca">
          <div className="contentLogoTitulo">
            <BookIcon color="primary" className="iconLivro"></BookIcon>
            
            <h1 className="titulo">Book Finder</h1>
            <button onClick={() => goToHome()}>Home</button>
          </div>
          </div>
        </div>
        </ThemeProvider>
  );
};

export default LikePage;
