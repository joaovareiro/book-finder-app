/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs, setDoc, where, query } from "firebase/firestore";
import BookIcon from "@mui/icons-material/Book";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { renderCarousel } from "../Home"; // Corrected import statement
import { db } from "../../firebase";
import axios from "axios";
import './style.css'

const Favoritos: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const [likedBooks, setLikedBooks] = useState<string[]>([]);
    const [carouselBooks, setCarouselBooks] = useState<any[]>([]);


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

    const collectBookList = async (bookIds: string[]) => {
        try {
            const bookPromises = bookIds.map(async (id) => {
                const response = await searchBook(id);
                return response?.data;
            });
            const books = await Promise.all(bookPromises);
            setCarouselBooks(books);
        } catch (error) {
            console.error(error);
        }
    };

    const searchBook = async (id: string) => {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const fetchLikedBooks = async () => {
        try {
            const usersCollection = collection(db, "users");
            const querySnapshot = await getDocs(query(usersCollection, where("login", "==", email)));

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const favoritos = userDoc.data().favoritos || [];
                setLikedBooks(favoritos);
                collectBookList(favoritos);
            } else {
                console.log("Usuário não encontrado");
            }
        } catch (error) {
            console.error("Error fetching liked books:", error);
        }
    };

    const handleLike = async (bookId: string) => {
        if (email) {
            try {
                const usersCollection = collection(db, "users");
                const querySnapshot = await getDocs(query(usersCollection, where("login", "==", email)));

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const favoritos = userDoc.data().favoritos || [];
                    const updatedFavoritos = favoritos.includes(bookId)
                        ? favoritos.filter((id: string) => id !== bookId)
                        : [...favoritos, bookId];
                    await setDoc(userDoc.ref, { favoritos: updatedFavoritos }, { merge: true });
                    setLikedBooks(updatedFavoritos);
                    collectBookList(updatedFavoritos); // Refresh carousel
                    console.log("Liked books updated");
                }
            } catch (error) {
                console.error("Error updating liked books:", error);
            }
        }
    };

    useEffect(() => {
        if (email) {
            fetchLikedBooks();
        }
    }, [email]);

    return (
        <div className="favoritosContainer">
            <div className="favoritosHeader">
                <Link to={`/home?email=${encodeURIComponent(email || "")}`} className="favoritosContentLogo">
                    <BookIcon color="primary" className="iconLivro"></BookIcon>
                    <p className="titulo">Book Finder</p>
                </Link>
            </div>
            {renderCarousel("Favoritos", carouselBooks, handleLike, likedBooks)}
        </div >
    );
};

export default Favoritos;
