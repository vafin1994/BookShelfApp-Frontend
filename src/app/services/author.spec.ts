import { TestBed } from '@angular/core/testing';

import { AuthorService } from './author';
import { afterEach, expect } from 'vitest';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Author } from '../interfaces/author';

const mockResponse: Author[] = [{ id: 1, name: 'Test Name', country: 'USA' }];

describe('AuthorService', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;
  const url = `${environment.apiUrl}/authors`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getListOfAuthors', () => {
    service.getListOfAuthors().subscribe();
    const req = httpMock.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should return the list of authors', () => {
    service.getListOfAuthors().subscribe((res: Author[]) => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(1);
      expect(res[0].country).toBe('USA');
    });

    const req = httpMock.expectOne(`${url}`);
    req.flush(mockResponse);
  });

  it('should return author by id', () => {
    service.getAuthorById(1).subscribe((res: Author) => {
      expect(res.id).toBe(mockResponse[0].id);
      expect(res.name).toBe(mockResponse[0].name);
    });
    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse[0]);
  });

  it('should call create author', () => {
    service.createAuthor(mockResponse[0]).subscribe();
    const req = httpMock.expectOne(`${url}`)
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse[0]);
  });

  it('should call update author', () => {
    service.updateAuthor(1, mockResponse[0]).subscribe();
    const req = httpMock.expectOne(`${url}/1`)
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse[0]);
  });

  it('should call delete author', () => {
    service.deleteAuthor(1).subscribe();
    const req = httpMock.expectOne(`${url}/1`)
    expect(req.request.method).toBe('DELETE');
    req.flush(1);
  });
});
