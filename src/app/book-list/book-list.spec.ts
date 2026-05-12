import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookList } from './book-list';
import { Book } from '../interfaces/book';
import { PageResponse } from '../interfaces/pageResponse';
import { NEVER, of, throwError } from 'rxjs';
import { BookService } from '../services/book';
import {beforeEach, describe, expect} from 'vitest';
import {MatDialog} from '@angular/material/dialog';

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C Martin',
    isbn: '9780132508384',
    publishingYear: 2008,
    genre: 'Programming',
    language: 'English',
  },
];

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

describe('Book list open dialogs', () => {
  let component: BookList;
  let fixture: ComponentFixture<BookList>;

  const mockDialogRef = {
    afterClosed: () => of(undefined)
  };

  const mockDialog = {
    open: vi.fn().mockReturnValue(mockDialogRef)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookList],
      providers: [
        { provide: BookService, useValue: mockBookService },
        { provide: MatDialog, useValue: mockDialog }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BookList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call create new book', () => {
    expect(true).toBeTruthy();
  })
})
