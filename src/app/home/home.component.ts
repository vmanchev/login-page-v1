import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../store/auth.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authStore.email()) {
        this.router.navigate(['/login']);
      }
    });
  }
}
