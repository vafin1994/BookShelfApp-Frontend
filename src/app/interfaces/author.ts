export interface AuthorBase {
  name: string;
  country: string;
}

export interface Author extends AuthorBase {
  id?: number;
}

export interface AuthorRequest extends AuthorBase {}
