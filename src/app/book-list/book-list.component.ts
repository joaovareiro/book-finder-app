import { Component, Input, OnInit } from '@angular/core';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @Input() genre!: string;
  books: Book[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    this.bookService.searchBooksByGenre(this.genre).subscribe(
      (data: Book[]) => {
        this.books = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
