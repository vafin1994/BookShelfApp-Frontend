import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, vi, describe } from 'vitest';
import { BookForm } from './book-form';
import { Book } from '../../interfaces/book';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

const book: Book = {
  id: 1,
  title: 'Clean Code',
  author: 'Robert C Martin',
  isbn: '9780132520884',
  publishingYear: 2008,
  genre: 'Programming',
  language: 'English',
};

describe('create book', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForm],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('should initialize empty form', () => {
    expect(component.form.value['title']).toBe('');
    expect(component.form.value['author']).toBe('');
    expect(component.form.value['isbn']).toBe('');
    expect(component.form.value['publishingYear']).toBe(null);
    expect(component.form.value['genre']).toBe('');
    expect(component.form.value['language']).toBe('');
  });

  it('submit button should be Add Book', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const submitButton = Array.from(buttons).find(
      (btn: any) => btn.textContent.trim() === 'Add Book'
    );
    expect(submitButton).toBeTruthy();
  })
});

describe('edit book', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForm],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: book },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should set the book form with dialogRef data', () => {
    expect(component.form.value['title']).toBe(book.title);
    expect(component.form.value['author']).toBe(book.author);
    expect(component.form.value['isbn']).toBe(book.isbn);
    expect(component.form.value['publishingYear']).toBe(book.publishingYear);
    expect(component.form.value['genre']).toBe(book.genre);
    expect(component.form.value['language']).toBe(book.language);
  });

  it('on close should close the dialog and pass data', () => {
    component.onSubmit();
    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalledWith(book);
  });

  it('should be valid, when all fields are valid', () => {
    expect(component.form.valid).toBe(true);
  })

  it('should be invalid when title is empty', () => {
    component.form.get('title')?.setValue('');
    component.form.get('title')?.markAsTouched();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('mat-error');
    expect(component.form.invalid).toBe(true);
    expect(element.textContent).toBe('Title is required');
  });

  it('should be invalid when author is empty', () => {
    component.form.get('author')?.setValue('');
    component.form.get('author')?.markAsTouched();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('mat-error');
    expect(component.form.invalid).toBe(true);
    expect(element.textContent).toBe('Author is required');
  });

  it('should be invalid when publishingYear is too small', () => {
    component.form.get('publishingYear')?.setValue(1000);
    component.form.get('publishingYear')?.markAsTouched();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('mat-error');
    expect(component.form.invalid).toBe(true);
    expect(element.textContent).toBe('Publishing Year should be between 1450 year and 2100 year');
  });

  it('should be invalid when ISBN is invalid', () => {
    component.form.get('isbn')?.setValue('999');
    component.form.get('isbn')?.markAsTouched();
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('mat-error');
    expect(component.form.invalid).toBe(true);
    expect(element.textContent).toBe('ISBN should be either 10 or 13 digits long');
  });

  it('should be invalid when language is too long', () => {
    component.form
      .get('language')
      ?.setValue(
        'too long language field too long language field too long language field too long language field',
      );
    component.form.get('language')?.markAsTouched();
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });

  it('submit button should be Save Book', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const submitButton = Array.from(buttons).find(
      (btn: any) => btn.textContent.trim() === 'Save Book'
    );
    expect(submitButton).toBeTruthy();
  })
});
