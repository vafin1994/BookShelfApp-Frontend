import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BookService } from '../services/book';
import { PageResponse } from '../interfaces/pageResponse';
import { Book } from '../interfaces/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookTable } from './book-table/book-table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-book-list',
  imports: [MatProgressSpinnerModule, BookTable, MatPaginator, MatPaginatorModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  booksList: WritableSignal<Book[]> = signal<Book[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Pagination
  totalElements = signal<number>(0);
  pageSize = signal<number>(5);
  pageIndex = signal<number>(0);

  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks(page = 0, size = 5, sortBy = 'title') {
    this.isLoading.set(true);
    this.error.set(null);
    this.bookService
      .getAllBooks(page, size, sortBy)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response: PageResponse<Book>) => {
          this.booksList.set(response.content);
          this.totalElements.set(response.totalElements);
        },
        error: () => {
          this.error.set('Failed to get books');
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getAllBooks(event.pageIndex, event.pageSize);
  }
}
