import { Component, inject, OnInit, signal } from '@angular/core';
import { Author } from '../interfaces/author';
import { AuthorService } from '../services/author';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-author-list',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatInput,
    MatFormField,
    MatLabel,
    MatButton,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList implements OnInit {
  private authorService: AuthorService = inject(AuthorService);
  public authors = signal<Author[]>([]);
  public editedAuthor = signal<number | null>(null);

  ngOnInit() {
    this.getAuthorsList();
  }

  private getAuthorsList() {
    this.authorService.getListOfAuthors().subscribe((response) => {
      this.authors.set(response);
    });
  }

  public addAuthor() {}

  public editAuthor(id: number | undefined) {
    if (id) {
      this.editedAuthor.set(id);
    }
  }
}
