import { Component, inject, OnInit, signal } from '@angular/core';
import { Author, AuthorRequest } from '../interfaces/author';
import { AuthorService } from '../services/author';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
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
  ],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css',
})
export class AuthorList implements OnInit {
  private authorService: AuthorService = inject(AuthorService);

  public authors = signal<Author[]>([]);
  public editedAuthor = signal<number | null>(null);

  public authorForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.getAuthorsList();
  }

  private getAuthorsList() {
    this.authorService.getListOfAuthors().subscribe((response) => {
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
        // TODO add error indicator
        console.log(err);
      },
    });
  }

  public editAuthor(id: number | undefined) {
    if (id) {
      this.editedAuthor.set(id);
    }
  }

  public saveAuthor() {
    this.editedAuthor.set(null);
  }
}
