import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/contact-list/contact-list.component').then(m => m.ContactListComponent) },
  { path: 'add', loadComponent: () => import('./components/contact-form/contact-form.component').then(m => m.ContactFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./components/contact-form/contact-form.component').then(m => m.ContactFormComponent) },
];
