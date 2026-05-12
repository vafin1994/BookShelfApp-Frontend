import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookList } from './book-list';
import { Book } from '../interfaces/book';
import { PageResponse } from '../interfaces/pageResponse';
import { NEVER, of, throwError } from 'rxjs';
import { BookService } from '../services/book';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookForm } from './book-form/book-form';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

const mockBook: Required<Book> = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C Martin',
  isbn: '9780132508384',
  publishingYear: 2008,
  genre: 'Programming',
  language: 'English',
};

const mockBooks: Book[] = [mockBook];

const mockPageResponse: PageResponse<Book> = {
  content: mockBooks,
  number: 0,
  size: 5,
  numberOfElements: 1,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

const mockBookService = {
  getAllBooks: () => of(mockPageResponse),
};

const errorBooksService = {
  getAllBooks: () => throwError(() => new Error('API Error')),
};

const loadingBooksService = {
  getAllBooks: () => NEVER,
};

describe('BookList', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load books on init', () => {
    expect(component.booksList()).toHaveLength(1);
    expect(component.booksList()[0].title).toBe('Clean Code');
    expect(component.isLoading()).toBeFalsy();
    expect(component.totalElements()).toBe(1);
  });

  it('should update books when page changes', () => {
    const newPageResponse: PageResponse<Book> = {
      ...mockPageResponse,
      number: 1,
      content: [
        {
          ...mockBooks[0],
          id: 2,
          title: 'Dirty Code',
        },
      ],
    };

    mockBookService.getAllBooks = () => of(newPageResponse);
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 9 });

    expect(component.pageIndex()).toBe(1);
    expect(component.booksList()[0].title).toBe('Dirty Code');
  });
});

describe('Book List API fails', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [{ provide: BookService, useValue: errorBooksService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set error state when API fails', () => {
    expect(component.error()).toBe('Failed to get books');
    expect(component.isLoading()).toBe(false);
  });

  it('should display error in template', () => {
    const element = fixture.nativeElement.querySelector('.error');
    expect(element).toBeTruthy();
    expect(element.textContent).not.toBe('');
  });
});

describe('Book List loading state', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [{ provide: BookService, useValue: loadingBooksService }],
    }).compileComponents();
    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set loading state to true', () => {
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(component.isLoading()).toBeTruthy();
    expect(spinnerElement).toBeTruthy();
  });
});

describe('Book list — openBookForm', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  const mockSnackBar = { open: vi.fn() };
  const mockDialogRef = { afterClosed: vi.fn() };
  const mockDialog = { open: vi.fn() };

  const dialogBookService = {
    getAllBooks: vi.fn(),
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    dialogBookService.getAllBooks.mockReturnValue(of(mockPageResponse));
    dialogBookService.createBook.mockReturnValue(of(mockBook));
    dialogBookService.updateBook.mockReturnValue(of(mockBook));
    dialogBookService.deleteBook.mockReturnValue(of(void 0));
    mockDialogRef.afterClosed.mockReturnValue(of(undefined));
    mockDialog.open.mockReturnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        { provide: BookService, useValue: dialogBookService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should open dialog with null data when creating', () => {
    component.openBookForm();
    expect(mockDialog.open).toHaveBeenCalledWith(BookForm, { width: '500px', data: null });
  });

  it('should open dialog with book data when editing', () => {
    component.openBookForm(mockBook);
    expect(mockDialog.open).toHaveBeenCalledWith(BookForm, { width: '500px', data: mockBook });
  });

  it('should call createBook when dialog returns a book without id', () => {
    const newBook: Book = { title: 'New Book', author: 'Author', isbn: '', genre: '', publishingYear: 2024, language: 'English' };
    mockDialogRef.afterClosed.mockReturnValue(of(newBook));
    component.openBookForm();
    expect(dialogBookService.createBook).toHaveBeenCalledWith(newBook);
  });

  it('should call updateBook when dialog returns a book with id', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(mockBook));
    component.openBookForm(mockBook);
    expect(dialogBookService.updateBook).toHaveBeenCalledWith(mockBook);
  });

  it('should not call createBook or updateBook when dialog is cancelled', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(undefined));
    component.openBookForm();
    expect(dialogBookService.createBook).not.toHaveBeenCalled();
    expect(dialogBookService.updateBook).not.toHaveBeenCalled();
  });

  it('should refresh book list after successful create', () => {
    const newBook: Book = { title: 'New Book', author: 'Author', isbn: '', genre: '', publishingYear: 2024, language: 'English' };
    mockDialogRef.afterClosed.mockReturnValue(of(newBook));
    component.openBookForm();
    // once on init, once after successful create
    expect(dialogBookService.getAllBooks).toHaveBeenCalledTimes(2);
  });

  it('should refresh book list after successful update', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(mockBook));
    component.openBookForm(mockBook);
    expect(dialogBookService.getAllBooks).toHaveBeenCalledTimes(2);
  });

  it('should show snackbar when createBook fails', () => {
    const newBook: Book = { title: 'New Book', author: 'Author', isbn: '', genre: '', publishingYear: 2024, language: 'English' };
    mockDialogRef.afterClosed.mockReturnValue(of(newBook));
    dialogBookService.createBook.mockReturnValue(throwError(() => new Error('API Error')));
    component.openBookForm();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to create book', 'Close', { duration: 3000 });
  });

  it('should show snackbar when updateBook fails', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(mockBook));
    dialogBookService.updateBook.mockReturnValue(throwError(() => new Error('API Error')));
    component.openBookForm(mockBook);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to update book', 'Close', { duration: 3000 });
  });
});

describe('Book list — openDeleteConfirmDialog', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  const mockSnackBar = { open: vi.fn() };
  const mockDialogRef = { afterClosed: vi.fn() };
  const mockDialog = { open: vi.fn() };

  const dialogBookService = {
    getAllBooks: vi.fn(),
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    dialogBookService.getAllBooks.mockReturnValue(of(mockPageResponse));
    dialogBookService.deleteBook.mockReturnValue(of(void 0));
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    mockDialog.open.mockReturnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        { provide: BookService, useValue: dialogBookService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should open confirm dialog with a message containing the book title', () => {
    component.openDeleteConfirmDialog(mockBook);
    expect(mockDialog.open).toHaveBeenCalledWith(
      ConfirmDialog,
      expect.objectContaining({ data: expect.stringContaining(mockBook.title) }),
    );
  });

  it('should call deleteBook when confirmed', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(true));
    component.openDeleteConfirmDialog(mockBook);
    expect(dialogBookService.deleteBook).toHaveBeenCalledWith(mockBook.id);
  });

  it('should not call deleteBook when cancelled', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(false));
    component.openDeleteConfirmDialog(mockBook);
    expect(dialogBookService.deleteBook).not.toHaveBeenCalled();
  });

  it('should refresh book list after successful delete', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(true));
    component.openDeleteConfirmDialog(mockBook);
    // once on init, once after successful delete
    expect(dialogBookService.getAllBooks).toHaveBeenCalledTimes(2);
  });

  it('should show snackbar when deleteBook fails', () => {
    mockDialogRef.afterClosed.mockReturnValue(of(true));
    dialogBookService.deleteBook.mockReturnValue(throwError(() => new Error('API Error')));
    component.openDeleteConfirmDialog(mockBook);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to delete book', 'Close', { duration: 3000 });
  });
});
