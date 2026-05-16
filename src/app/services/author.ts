import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, AuthorRequest } from '../interfaces/author';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/authors`;

  public getListOfAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  public getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>(this.apiUrl + '/' + id);
  }

  public createAuthor(author: AuthorRequest): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  public updateAuthor(id: number, author: AuthorRequest): Observable<Author> {
    return this.http.put<Author>(this.apiUrl + '/' + id, author);
  }

  public deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}
