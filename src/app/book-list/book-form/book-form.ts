import { Component, inject, OnInit, signal } from '@angular/core';
import {Book, BookFormResult, BookRequest} from '../../interfaces/book';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { AuthorService } from '../../services/author';
import { Author } from '../../interfaces/author';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-book-form',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatSelect,
    MatOption,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  private authorsService: AuthorService = inject(AuthorService);

  public dialogRef: MatDialogRef<BookForm, BookFormResult> = inject(MatDialogRef<BookForm>);
  data = inject<Book | null>(MAT_DIALOG_DATA);
  listOfAuthors = signal<Author[]>([]);

  form!: FormGroup;

  ngOnInit() {
    this.getAuthors();
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      title: [this.data?.title ?? '', Validators.required],
      authorId: [this.data?.authorId ?? '', Validators.required],
      isbn: [this.data?.isbn ?? null, [Validators.pattern(/^(\d{10}|\d{13})$/)]],
      publishingYear: [
        this.data?.publishingYear ?? null,
        [Validators.min(1450), Validators.max(2100)],
      ],
      genre: [this.data?.genre ?? ''],
      language: [this.data?.language ?? '', Validators.maxLength(50)],
    });
  }

  private getAuthors() {
    this.authorsService.getListOfAuthors().subscribe((response: Author[]) => {
      this.listOfAuthors.set(response);
    });
  }

  public onSubmit() {
    const book: BookFormResult = {
      ...this.form.value,
      id: this.data?.id,
    };
    this.dialogRef.close(book);
  }
}
