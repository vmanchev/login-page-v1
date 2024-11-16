import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { AuthService } from '../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { AuthRequest } from '../shared/interfaces/auth-request.interface';
import { inject, Signal } from '@angular/core';


// Define the store type explicitly
interface AuthStoreType {
  email: Signal<string | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  isInvalid: Signal<boolean>;
  login: (request: AuthRequest) => void;
  logout: () => void;
}

describe('AuthStore', () => {
  let store: AuthStoreType;
  let authService: jasmine.SpyObj<AuthService>;

  const mockAuthResponse = {
    email: 'test@example.com',
    token: 'mock-token'
  };

  const mockErrorResponse = new HttpErrorResponse({
    error: { message: 'Invalid credentials' },
    status: 401,
    statusText: 'Unauthorized'
  });

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    });

    store = TestBed.runInInjectionContext(() => inject(AuthStore));
  });

  it('should create the store with initial state', () => {
    expect(store.email()).toBeNull();
    expect(store.isLoading()).toBeFalse();
    expect(store.error()).toBeNull();
    expect(store.isInvalid()).toBeFalse();
  });

  describe('login', () => {
    const loginPayload = {
      username: 'test@example.com',
      password: 'password123'
    };

    it('should handle successful login', fakeAsync(() => {
      authService.login.and.returnValue(of(mockAuthResponse));

      // Trigger login
      store.login(loginPayload);

      // Should immediately set loading state
      expect(store.isLoading()).toBeTrue();
      expect(store.error()).toBeNull();

      // Wait for debounce time
      tick(3000);

      // Verify final state
      expect(store.email()).toBe(mockAuthResponse.email);
      expect(store.isLoading()).toBeFalse();
      expect(store.error()).toBeNull();
      expect(store.isInvalid()).toBeFalse();
    }));

    it('should handle login error', fakeAsync(() => {
      authService.login.and.returnValue(throwError(() => mockErrorResponse));

      // Trigger login
      store.login(loginPayload);

      // Should immediately set loading state
      expect(store.isLoading()).toBeTrue();
      expect(store.error()).toBeNull();

      // Wait for debounce time
      tick(3000);

      // Verify error state
      expect(store.email()).toBeNull();
      expect(store.isLoading()).toBeFalse();
      expect(store.error()).toBe('Invalid credentials');
      expect(store.isInvalid()).toBeTrue();
    }));

    it('should debounce login requests', fakeAsync(() => {
      authService.login.and.returnValue(of(mockAuthResponse));

      // Trigger multiple login attempts
      store.login(loginPayload);
      store.login(loginPayload);
      store.login(loginPayload);

      tick(2999); // Just before debounce time
      expect(authService.login).not.toHaveBeenCalled();

      tick(1); // Complete debounce time
      expect(authService.login).toHaveBeenCalledTimes(1);
    }));
  });

  describe('logout', () => {
    it('should clear email while preserving other state', fakeAsync(() => {
      // Set up initial state
      authService.login.and.returnValue(of(mockAuthResponse));
      store.login({ username: 'test@example.com', password: 'password123' });

      tick(3000); // Wait for login to complete

      // Perform logout
      store.logout();

      // Verify state after logout
      expect(store.email()).toBeNull();
      expect(store.isLoading()).toBeFalse();
      expect(store.error()).toBeNull();
      expect(store.isInvalid()).toBeFalse();
    }));
  });

  describe('computed properties', () => {
    it('should correctly calculate isInvalid', fakeAsync(() => {
      // Initial state
      expect(store.isInvalid()).toBeFalse();

      // With loading
      authService.login.and.returnValue(throwError(() => mockErrorResponse));
      store.login({ username: 'test@example.com', password: 'wrong' });
      expect(store.isInvalid()).toBeFalse();

      tick(3000); // Wait for login to complete

      // After error
      expect(store.isInvalid()).toBeTrue();
    }));
  });
});
