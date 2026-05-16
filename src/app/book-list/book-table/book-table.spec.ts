import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTable } from './book-table';
import { Book } from '../../interfaces/book';
import { expect } from 'vitest';

const book: Required<Book> = {
  id: 1,
  title: 'Clean Code',
  authorName: 'Robert C Martin',
  authorId: 1,
  isbn: '9780132508284',
  publishingYear: 2008,
  genre: 'Programming',
  language: 'English',
};

describe('BookTable', () => {
  let component: BookTable;
  let fixture: ComponentFixture<BookTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BookTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editBook', () => {
    let emittedBook: Book | undefined;
    component.editBook.subscribe((emitted) => (emittedBook = emitted));
    component.onEditBook(book);
    expect(emittedBook?.id).toBe(book.id);
  });

  it('should emit deleteBook', () => {
    let deletedBook: Book | undefined;
    component.deleteBook.subscribe((emitted) => (deletedBook = emitted));
    component.onDeleteBook(book);
    expect(deletedBook?.id).toBe(book.id);
  });
});
