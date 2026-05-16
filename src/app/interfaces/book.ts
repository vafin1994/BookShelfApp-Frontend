export interface BookBase {
  title: string;
  authorId: number;
  isbn: string;
  publishingYear: number;
  genre: string;
  language: string;
}

export interface Book extends BookBase {
  id?: number;
  authorName: string;
}

export interface BookRequest extends BookBase {}

export interface BookFormResult extends BookRequest {
  id?: number;
}
