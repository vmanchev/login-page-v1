import { Component, effect, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PASSWORD_MIN_LENGTH, PASSWORD_PATTERN } from './validator.constants';
import { AuthStore } from '../store/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup = this.getLoginForm();
  authStore = inject(AuthStore);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authStore.email()) {
        this.router.navigate(['/home']);
      }
    });
  }

  onSubmit() {
    this.loginForm.markAsDirty();
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) {
      return;
    }

    this.authStore.login(this.loginForm.value);
  }

  private getLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.pattern(PASSWORD_PATTERN),
      ]),
    });
  }
}
