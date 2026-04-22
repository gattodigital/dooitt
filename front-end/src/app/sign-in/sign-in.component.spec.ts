import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { SignInComponent } from './sign-in.component';
import { ApiService } from '../api.service';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['postUserSignIn']);

    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.get(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validate()', () => {
    it('returns error when email is empty', () => {
      component.signInData = { email: '', password: 'Password1' };
      expect(component.validate()).toMatch(/required/i);
    });

    it('returns error for invalid email format', () => {
      component.signInData = { email: 'not-an-email', password: 'Password1' };
      expect(component.validate()).toMatch(/valid email/i);
    });

    it('returns error when password is empty', () => {
      component.signInData = { email: 'user@example.com', password: '' };
      expect(component.validate()).toMatch(/required/i);
    });

    it('returns empty string for valid data', () => {
      component.signInData = { email: 'user@example.com', password: 'Password1' };
      expect(component.validate()).toBe('');
    });
  });

  describe('Post()', () => {
    it('sets errorMessage and does not call API when validation fails', () => {
      component.signInData = { email: '', password: '' };
      component.Post();
      expect(apiServiceSpy.postUserSignIn).not.toHaveBeenCalled();
      expect(component.errorMessage).toBeTruthy();
    });

    it('stores token and navigates on success', () => {
      component.signInData = { email: 'user@example.com', password: 'Password1' };
      apiServiceSpy.postUserSignIn.and.returnValue(of({ token: 'mock-token' }));
      spyOn(localStorage, 'setItem');

      component.Post();

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    });

    it('sets errorMessage from server on API error', () => {
      component.signInData = { email: 'user@example.com', password: 'Password1' };
      apiServiceSpy.postUserSignIn.and.returnValue(
        throwError({ error: { message: 'Invalid email or password.' } })
      );

      component.Post();

      expect(component.errorMessage).toBe('Invalid email or password.');
    });

    it('sets fallback errorMessage when server error has no message', () => {
      component.signInData = { email: 'user@example.com', password: 'Password1' };
      apiServiceSpy.postUserSignIn.and.returnValue(throwError({}));

      component.Post();

      expect(component.errorMessage).toBeTruthy();
    });
  });
});
