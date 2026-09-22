import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FriendsService } from '../friends.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'squirrelli-edit-friend',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './edit-friend.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class EditFriend implements OnInit {
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });
  protected loading = false;
  protected friendId: string | null = null;

  constructor(
    private readonly friendsService: FriendsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.friendId = this.route.snapshot.paramMap.get('id');
    const friend = this.route.snapshot.data['friend'];
    if (friend) {
      this.form.patchValue({ name: friend.name, email: friend.email ?? '' });
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
    const request = this.friendId
      ? this.friendsService.updateFriend(this.friendId, value)
      : this.friendsService.createFriend(value);

    request
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.router.navigate(['/expenses/friends']));
  }
}
