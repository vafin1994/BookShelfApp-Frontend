import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BookService } from '../services/book';
import { PageResponse } from '../interfaces/pageResponse';
import { Book } from '../interfaces/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-book-list',
  imports: [],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  booksList: WritableSignal<Book[]> = signal<Book[]>([]);
  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.bookService
      .getAllBooks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: PageResponse<Book>) => {
        this.booksList.set(response.content);
        console.log('Books: ', this.booksList);
      });
  }
}
