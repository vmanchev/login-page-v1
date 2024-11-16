import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private email = 'hello@edited.com';
  private password = 'hello123';

  authState = inject(AuthStore);

  ngOnInit() {
    this.authState.login({
      username: this.email,
      password: this.password,
    });
  }
}
