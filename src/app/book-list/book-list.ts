import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BookService } from '../services/book';
import { PageResponse } from '../interfaces/pageResponse';
import { Book } from '../interfaces/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-book-list',
  imports: [MatTableModule, MatProgressSpinnerModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  booksList: WritableSignal<Book[]> = signal<Book[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  displayedColumns = ['title', 'author', 'genre', 'publishingYear'];

  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.isLoading.set(true);
    this.error.set(null);
    this.bookService
      .getAllBooks()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: PageResponse<Book>) => {
          this.booksList.set(response.content);
          console.log('Books: ', this.booksList);
        },
        error: (error) => {
          this.error.set('Failed to get books');
        },
      });
  }
}
