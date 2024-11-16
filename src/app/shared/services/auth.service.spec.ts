import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { AuthSuccessResponse } from '../interfaces/auth-success-response.interface';
import { take } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const TEST_EMAIL = 'test@example.org';
  const TEST_PASSWORD = 'test123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request to /api/login with the correct payload', () => {
    // arrange
    const payload: AuthRequest = {
      username: TEST_EMAIL,
      password: TEST_PASSWORD,
    };
    const mockResponse: AuthSuccessResponse = {
      email: TEST_EMAIL,
    };

    // act
    service
      .login(payload)
      .pipe(take(1))
      .subscribe((response) => {
        // assert
        expect(response).toEqual(mockResponse);
      });

    // assert HTTP request
    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  it('should handle HTTP errors gracefully', () => {
    // arrange
    const payload: AuthRequest = {
      username: 'test@example.com',
      password: 'TestPassword123',
    };
    const mockError = {
      code: 400,
      message: 'Invalid credentials',
    };

    // act
    service
      .login(payload)
      .pipe(take(1))
      .subscribe({
        next: () => fail('Expected error response, but got success'),
        error: (error) => {
          // assert
          expect(error.error.code).toBe(mockError.code);
          expect(error.error.message).toBe(mockError.message);
        },
      });

    // Simulate HTTP error
    const req = httpMock.expectOne('/api/login');
    req.flush(mockError, { status: 400, statusText: 'Bad Request' });
  });
});
