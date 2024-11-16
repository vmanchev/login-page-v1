import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | undefined {
    return !!localStorage.getItem(key)?.length
      ? (JSON.parse(localStorage.getItem(key) as string) as T)
      : undefined;
  }

  reset(key: string): void {
    localStorage.clear();
  }
}
