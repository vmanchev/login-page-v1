import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { REMEMBER_ME_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class RememberMeService {
  private storageService = inject(StorageService);

  get(): string | undefined {
    return this.storageService.get<Pick<AuthRequest, 'username'>>(REMEMBER_ME_KEY)
      ?.username;
  }

  set(flag: boolean, username: string): void {
    if (flag) {
      this.storageService.set(REMEMBER_ME_KEY, { username });
    } else {
      this.storageService.reset(REMEMBER_ME_KEY);
    }
  }
}
