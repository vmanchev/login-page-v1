import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthStore } from '../store/auth.store';

describe('authGuard', () => {
  const TEST_EMAIL = 'test@example.org';
  const AuthStoreMock = jasmine.createSpyObj('AuthStore', ['email']);
  const RouterMock = jasmine.createSpyObj('Router', ['navigate']);

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: AuthStoreMock },
        { provide: Router, useValue: RouterMock },
      ],
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      AuthStoreMock.email.and.returnValue(TEST_EMAIL);
      RouterMock.navigate.calls.reset();
    });

    it('should return true', () => {
      // act && assert
      expect(
        executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      ).toBeTrue();
    });

    it('should not redirect to /login', () => {
      // act
      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

      // assert
      expect(RouterMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      AuthStoreMock.email.and.returnValue(null);
      RouterMock.navigate.calls.reset();
    });

    it('should return false', () => {
      // act && assert
      expect(
        executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      ).toBeFalse();
    });

    it('should redirect to /login', () => {
      // act
      executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

      // assert
      expect(RouterMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
