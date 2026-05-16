import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { BookService } from '../services/book';
import { PageResponse } from '../interfaces/pageResponse';
import {Book, BookFormResult, BookRequest} from '../interfaces/book';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookTable } from './book-table/book-table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookForm } from './book-form/book-form';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);

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
    const dialogRef: MatDialogRef<BookForm, BookFormResult> = this.dialog.open(BookForm, {
      width: '500px',
      data: book,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: BookFormResult | undefined) => {
        if (result && result.id) {
          const bookRequest: BookRequest = {
            title: result.title,
            authorId: result.authorId,
            isbn: result.isbn,
            publishingYear: result.publishingYear,
            genre: result.genre,
            language: result.language,
          };
          this.bookService.updateBook(result.id, bookRequest).subscribe({
            next: (_response: Book | null) => {
              this.getAllBooks(this.pageIndex(), this.pageSize());
            },
            error: (_err) => {
              this.snackBar.open('Failed to update book', 'Close', { duration: 3000 });
            },
          });
        } else if (result) {
          this.bookService.createBook(result).subscribe({
            next: (_response: Book | null) => {
              this.getAllBooks(this.pageIndex(), this.pageSize());
            },
            error: (_err) => {
              this.snackBar.open('Failed to create book', 'Close', { duration: 3000 });
            },
          });
        } else {
          return;
        }
      });
  }

  public openDeleteConfirmDialog(book: Required<Book>): void {
    const dialogRef: MatDialogRef<ConfirmDialog, boolean> = this.dialog.open(ConfirmDialog, {
      width: '200px',
      data: 'Are you sure you want to delete ' + book.title + ' book',
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean | undefined) => {
        if (result) {
          this.bookService.deleteBook(book.id).subscribe({
            next: () => {
              this.getAllBooks(this.pageIndex(), this.pageSize());
            },
            error: (_err) => {
              this.snackBar.open('Failed to delete book', 'Close', { duration: 3000 });
            },
          });
        }
      });
  }
}
