import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BookService } from '../services/book';
import { PageResponse } from '../interfaces/pageResponse';
import { Book } from '../interfaces/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookTable } from './book-table/book-table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookForm } from './book-form/book-form';

@Component({
  selector: 'app-book-list',
  imports: [MatProgressSpinnerModule, BookTable, MatPaginator, MatPaginatorModule, MatButton],
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
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.getAllBooks();
  }

  private getAllBooks(page = 0, size = 5, sortBy = 'title') {
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

  public onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getAllBooks(event.pageIndex, event.pageSize);
  }

  public openBookForm(book: Book | null = null) {
    const dialogRef: MatDialogRef<BookForm, Book> = this.dialog.open(BookForm, {
      width: '500px',
      data: book,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Book | undefined) => {
        if (result && result.id) {
          console.log('Update book id:', result.id);
        } else if (result) {
          console.log('Create a new book');
        } else {
          return;
        }
      });
  }
}
