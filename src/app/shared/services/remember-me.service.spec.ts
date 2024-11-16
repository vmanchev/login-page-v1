import { TestBed } from '@angular/core/testing';
import { RememberMeService } from './remember-me.service';
import { StorageService } from './storage.service';
import { REMEMBER_ME_KEY } from '../constants';
import { AuthRequest } from '../interfaces/auth-request.interface';

describe('RememberMeService', () => {
  let service: RememberMeService;
  let storageServiceMock = jasmine.createSpyObj('StorageService', [
    'get',
    'set',
    'reset',
  ]);
  const TEST_EMAIL = 'test@example.org';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RememberMeService,
        { provide: StorageService, useValue: storageServiceMock },
      ],
    });

    service = TestBed.inject(RememberMeService);
  });

  describe('get', () => {
    describe('when username is available in storage', () => {
      beforeEach(() => {
        // arrange
        storageServiceMock.get.calls.reset();
        storageServiceMock.get.and.returnValue({ username: TEST_EMAIL } as Pick<
          AuthRequest,
          'username'
        >);
      });

      it('should call storage.get() with expected param', () => {
        // act
        const result = service.get();

        // assert
        expect(storageServiceMock.get).toHaveBeenCalledWith(REMEMBER_ME_KEY);
      });

      it('should return the username', () => {
        // act
        const result = service.get();

        // assert
        expect(result).toBe(TEST_EMAIL);
      });
    });

    describe('when username is not available in storage', () => {
      beforeEach(() => {
        // arrange
        storageServiceMock.get.calls.reset();
        storageServiceMock.get.and.returnValue(undefined);
      });

      it('should call storage.get() with expected param', () => {
        // act
        const result = service.get();

        // assert
        expect(storageServiceMock.get).toHaveBeenCalledWith(REMEMBER_ME_KEY);
      });

      it('should return undefined if there is no username in storage', () => {
        // act
        const result = service.get();

        // assert
        expect(result).toBeUndefined();
      });
    });
  });

  describe('set', () => {
    beforeEach(() => {
      storageServiceMock.set.calls.reset();
      storageServiceMock.reset.calls.reset();
    });

    describe('when called with flag = true', () => {
      beforeEach(() => {
        // act
        service.set(true, TEST_EMAIL);
      });

      it('should call storage.set() with expected params', () => {
        expect(storageServiceMock.set).toHaveBeenCalledWith(REMEMBER_ME_KEY, {
          username: TEST_EMAIL,
        });
      });

      it('should not call storage.reset()', () => {
        expect(storageServiceMock.reset).not.toHaveBeenCalled();
      });
    });

    describe('when called with flag = false', () => {
      beforeEach(() => {
        // act
        service.set(false, TEST_EMAIL);
      });

      it('should call storage.reset() with expected param', () => {
        expect(storageServiceMock.reset).toHaveBeenCalledWith(REMEMBER_ME_KEY);
      });

      it('should not call storage.set()', () => {
        expect(storageServiceMock.set).not.toHaveBeenCalled();
      });
    });
  });
});
