import {Component, EventEmitter, input, output, Output} from '@angular/core';
import { MatCell } from '@angular/material/table';
import { Book } from '../../interfaces/book';
import { MatTableModule } from '@angular/material/table';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-book-table',
  imports: [MatCell, MatTableModule, MatButton],
  templateUrl: './book-table.html',
  styleUrl: './book-table.css',
})
export class BookTable {
  editBook = output<Required<Book>>();
  deleteBook = output<Required<Book>>();
  booksList = input<Book[]>([]);

  displayedColumns = ['title', 'author', 'genre', 'publishingYear', 'action'];

  onEditBook(book: Required<Book>) {
    this.editBook.emit(book);
  }

  onDeleteBook(book: Required<Book>) {
    this.deleteBook.emit(book);
  }
}
