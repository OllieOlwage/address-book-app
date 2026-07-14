import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  searchTerm = '';
  displayedColumns = ['name', 'cellNumber', 'email', 'actions'];

  ngOnInit(): void {
    this.loadContacts();
  }

  get filteredContacts(): Contact[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.contacts();
    return this.contacts().filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }

  loadContacts(): void {
    this.loading.set(true);
    this.contactService.getAll().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load contacts', 'Dismiss', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  addContact(): void {
    this.router.navigate(['/add']);
  }

  editContact(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  deleteContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { firstName: contact.firstName, lastName: contact.lastName },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.contactService.delete(contact.id).subscribe({
          next: () => {
            this.snackBar.open('Contact deleted', 'Dismiss', { duration: 2000 });
            this.loadContacts();
          },
          error: () => {
            this.snackBar.open('Failed to delete contact', 'Dismiss', { duration: 3000 });
          },
        });
      }
    });
  }
}
