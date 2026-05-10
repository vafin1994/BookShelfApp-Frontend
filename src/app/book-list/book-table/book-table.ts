import { Component, input } from '@angular/core';
import { MatCell } from '@angular/material/table';
import { Book } from '../../interfaces/book';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-book-table',
  imports: [MatCell, MatTableModule],
  templateUrl: './book-table.html',
  styleUrl: './book-table.css',
})
export class BookTable {
  booksList = input<Book[]>([]);

  displayedColumns = ['title', 'author', 'genre', 'publishingYear'];
}
