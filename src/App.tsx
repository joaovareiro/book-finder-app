import React, { useState } from "react";
import axios from "axios";
import BookIcon from "@mui/icons-material/Book";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import "./App.css";

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);

  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchBooks();
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
      {" "}
      <div className="conteiner">
        <div className="contentBusca">
          <div className="contentLogoTitulo">
            <BookIcon color="primary" className="iconLivro"></BookIcon>
            <h1 className="titulo">Book Finder</h1>
          </div>
          <Paper className="pesquisa"
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
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={searchBooks}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>

        <h1 className="TituloListagemLivros">Mais Vendidos</h1>
        <h1 className="TituloListagemLivroSecudanrio">ver mais</h1>
        <div className="contentlistaLivros">
          {books.map((book) => (
            <div key={book.id} className="contentLivro">
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="imgLivro"
              />
              <h4 className="tituloLivro">{book.volumeInfo.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

