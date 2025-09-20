export type Author = {
  id: number;
  birthDate: string;
  name: string;
  description: string;
  image: string;
};


export type AuthorCreate = {
  name: string;
  birthDate: string; // yyyy-mm-dd
  image?: string;
  description?: string;
};


