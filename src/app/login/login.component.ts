import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = 'hello@edited.com';
  password = 'hello123';

  constructor(private http: HttpClient) {
    this.http
      .post('/api/login', { username: this.username, password: this.password })
      .subscribe(console.log);
  }
}
