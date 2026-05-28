import { Component, inject, OnInit, signal } from '@angular/core';
import { Author, AuthorRequest } from '../interfaces/author';
import { AuthorService } from '../services/author';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take } from 'rxjs';

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
    ReactiveFormsModule,
    MatCardTitle,
  ],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList implements OnInit {
  private authorService: AuthorService = inject(AuthorService);

  public authors = signal<Author[]>([]);
  public editedAuthorData = signal<Author | null>(null);

  public authorForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getAuthorsList();
  }

  private getAuthorsList() {
    this.authorService
      .getListOfAuthors()
      .pipe(take(1))
      .subscribe((response) => {
        this.authors.set(response);
      });
  }

  public addAuthor() {
    const author: AuthorRequest = {
      name: this.authorForm.value.name,
      country: this.authorForm.value.country,
    };
    this.authorService.createAuthor(author).subscribe({
      next: (res) => {
        this.authors.update((authors) => [...authors, res]);
        this.authorForm.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public editAuthor(author: Author) {
    if (author.id) {
      this.editedAuthorData.set(author);
    }
  }

  public deleteAuthor(authorId: number | undefined) {
    if (authorId) {
      this.authorService.deleteAuthor(authorId).subscribe({
        next: () => {
          this.getAuthorsList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  public saveAuthor() {
    const author: Author | null = this.editedAuthorData();
    if (author && author.id) {
      this.authorService.updateAuthor(author.id, author).subscribe({
        next: (res) => {
          this.authors.update((authors) => authors.map((a) => (a.id === res.id ? res : a)));
          this.editedAuthorData.set(null);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  public inputChanges(fieldName: string, eventTarget: EventTarget | null) {
    if (eventTarget) {
      const value = (eventTarget as HTMLInputElement).value;
      const author: Author = {
        ...this.editedAuthorData(),
        [fieldName]: value,
      } as Author;
      this.editedAuthorData.set(author);
    }
  }
}
