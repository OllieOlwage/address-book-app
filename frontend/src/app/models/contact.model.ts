export interface ContactInput {
  firstName: string;
  lastName: string;
  cellNumber: string;
  email: string;
}

export interface Contact extends ContactInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
