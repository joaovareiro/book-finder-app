import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  bookId!: string;
  book!: Book | null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.getBookDetails();
  }

  getBookDetails() {
    this.bookService.getBookDetails(this.bookId).subscribe(
      (book: Book) => {
        this.book = book;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}