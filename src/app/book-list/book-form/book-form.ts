import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../interfaces/book';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';

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
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef: MatDialogRef<BookForm, Book> = inject(MatDialogRef<BookForm>);
  data = inject<Book | null>(MAT_DIALOG_DATA);

  form!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      title: [this.data?.title ?? '', Validators.required],
      author: [this.data?.author ?? '', Validators.required],
      isbn: [this.data?.isbn ?? ''],
      publishingYear: [this.data?.publishingYear ?? null],
      genre: [this.data?.genre ?? ''],
      language: [this.data?.language ?? ''],
    });
  }

  public onSubmit() {
    const book: Book = {
      ...this.form.value,
      id: this.data?.id,
    };
    this.dialogRef.close(book);
  }
}
