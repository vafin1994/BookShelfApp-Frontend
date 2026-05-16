import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookService } from './book';
import { afterEach, beforeEach, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PageResponse } from '../interfaces/pageResponse';
import { Book, BookRequest } from '../interfaces/book';

const book: BookRequest = {
  title: 'Clean Code',
  authorId: 1,
  isbn: '9780132508484',
  publishingYear: 2008,
  genre: 'Programming',
  language: 'English',
};

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllBooks', () => {
    service.getAllBooks(0, 5, 'title').subscribe();
    const req = httpMock.expectOne('http://localhost:8080/books?page=0&size=5&sortBy=title');

    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should return page response with books', () => {
    const mockResponse: PageResponse<Book> = {
      content: [
        {
          id: 1,
          title: 'Clean Code',
          authorId: 1,
          authorName: 'Robert C. Martin',
          isbn: '9780132350884',
          publishingYear: 2008,
          genre: 'Programming',
          language: 'English',
        },
      ],
      number: 0,
      size: 5,
      numberOfElements: 1,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    };

    service.getAllBooks().subscribe((response) => {
      expect(response.content.length).toBe(1);
      expect(response.content[0].title).toBe('Clean Code');
      expect(response.totalElements).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/books?page=0&size=10&sortBy=title');
    req.flush(mockResponse);
  });

  it('should use default parameters if none provided', () => {
    service.getAllBooks().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/books?page=0&size=10&sortBy=title');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call createBook', () => {
    service.createBook(book).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/books');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(book);
    req.flush({});
  });

  it('should call updateBook', () => {
    service.updateBook(1, book).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/books/' + 1);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(book);
    req.flush({});
  });

  it('should call deleteBook', () => {
    service.deleteBook(1).subscribe();
    const req = httpMock.expectOne('http://localhost:8080/books/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
