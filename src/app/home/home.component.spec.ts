import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthStore } from '../store/auth.store';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const AuthStoreMock = jasmine.createSpyObj('AuthStore', ['email']);
  const RouterMock = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        HomeComponent,
        { provide: AuthStore, useValue: AuthStoreMock },
        { provide: Router, useValue: RouterMock },
      ],
    })
      .overrideComponent(HomeComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to /login if authStore.email() returns falsy', () => {
    // arrange
    RouterMock.navigate.calls.reset();
    AuthStoreMock.email.and.returnValue(null);

    // act
    TestBed.inject(HomeComponent);
    fixture.detectChanges();

    // assert
    expect(RouterMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate to /login if authStore.email() returns a truthy value', () => {
    // arrange
    RouterMock.navigate.calls.reset();
    AuthStoreMock.email.and.returnValue('test@example.com');

    // act
    TestBed.inject(HomeComponent);
    fixture.detectChanges();

    // assert
    expect(RouterMock.navigate).not.toHaveBeenCalled();
  });
});
