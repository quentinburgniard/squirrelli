import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PartnersService } from '../partners.service';

@Component({
  selector: 'squirrelli-edit-partner',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-partner.html',
  host: { class: 'flex flex-col gap-4' },
})
export class EditPartner implements OnInit {
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected loading = false;
  protected partnerId: string | null = null;

  constructor(
    private readonly partnersService: PartnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
    const partner = this.route.snapshot.data['partner'];
    if (partner) {
      this.form.patchValue({ name: partner.name, email: partner.email ?? '' });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    const value = {
      name: this.form.controls.name.value.trim(),
      email: this.form.controls.email.value.trim(),
    };
    const request = this.partnerId
      ? this.partnersService.updatePartner(this.partnerId, value)
      : this.partnersService.createPartner(value);

    request
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.router.navigate(['/settings']));
  }
}
