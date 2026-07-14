import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactService = inject(ContactService);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  contactId: string | null = null;
  loading = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    cellNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{7,15}$/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });

  get title(): string {
    return this.isEditMode ? 'Edit Contact' : 'Add Contact';
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    if (this.contactId) {
      this.isEditMode = true;
      this.loading.set(true);
      this.contactService.getById(this.contactId).subscribe({
        next: (contact) => {
          this.form.patchValue(contact);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Contact not found', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/']);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const input = this.form.getRawValue();

    const request$ = this.isEditMode
      ? this.contactService.update(this.contactId!, input)
      : this.contactService.create(input);

    request$.subscribe({
      next: () => {
        const msg = this.isEditMode ? 'Contact updated' : 'Contact created';
        this.snackBar.open(msg, 'Dismiss', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'Something went wrong';
        this.snackBar.open(msg, 'Dismiss', { duration: 3000 });
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
