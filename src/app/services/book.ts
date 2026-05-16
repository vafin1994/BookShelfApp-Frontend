import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageResponse } from '../interfaces/pageResponse';
import {Book, BookRequest} from '../interfaces/book';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

  public getAllBooks(page = 0, size = 10, sortBy = 'title'): Observable<PageResponse<Book>> {
    const httpParams: HttpParams = new HttpParams()
      .append('page', page)
      .append('size', size)
      .append('sortBy', sortBy);
    return this.http.get<PageResponse<Book>>(this.apiUrl, { params: httpParams });
  }

  public createBook(book: BookRequest): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  public updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
