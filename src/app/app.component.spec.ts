import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthStore } from './store/auth.store';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthStore, useValue: {} }],
    })
      .overrideComponent(AppComponent, { set: { template: '' } })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
