import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number
  genre: string;
  imageUrl: string;
}

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBookDetails(bookId: string): Observable<Book> {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}&key=AIzaSyAy7y_LU8vyndhIVNZ2DNj3gUvcOlfR-Q4`;

    return this.http.get<Book>(apiUrl);
  }

  searchBooksByTitle(title: string) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=AIzaSyAy7y_LU8vyndhIVNZ2DNj3gUvcOlfR-Q4`;

    return this.http.get(apiUrl);
  }

  searchBooksByGenre(genre: string): Observable<any> {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&key=AIzaSyAy7y_LU8vyndhIVNZ2DNj3gUvcOlfR-Q4`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => {
      if (response.items) {
        return response.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(', ') || 'Autor não encontrado',
          description: item.volumeInfo.description || 'Descrição ',
          price: item.saleInfo.listPrice?.amount || 0,
          genre: genre,
          imageUrl: item.volumeInfo.imageLinks?.thumbnail || ''
        }));
      } else {
        return [];
      }
    })
  );
  }  
}


