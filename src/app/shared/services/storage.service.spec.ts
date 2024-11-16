import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { AuthRequest } from '../interfaces/auth-request.interface';

describe('StorageService', () => {
  let service: StorageService;

  const TEST_EMAIL = 'test@example.org';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    service = TestBed.inject(StorageService);

    // Mock localStorage
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'getItem').and.callFake(() => null);
    spyOn(localStorage, 'clear').and.callFake(() => {});
  });

  describe('set', () => {
    it('should set a value in localStorage', () => {
      // Arrange
      const key = 'testKey';
      const value = { username: TEST_EMAIL };

      // act
      service.set(key, value);

      // assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(value)
      );
    });
  });

  describe('get', () => {
    it('should return a parsed value from localStorage when value under selected key is found', () => {
      // Arrange
      const key = 'testKey';
      const value = { username: TEST_EMAIL };
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify(value)
      );

      // act
      const result = service.get<Pick<AuthRequest, 'username'>>(key);

      // assert
      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return undefined when called with a non-existent key', () => {
      // Arrange
      const key = 'nonExistentKey';
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      // act
      const result = service.get<Pick<AuthRequest, 'username'>>(key);

      // assert
      expect(localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should clear all data in localStorage when reset() is called', () => {
      // act
      service.reset('anyKey');

      // assert
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});
