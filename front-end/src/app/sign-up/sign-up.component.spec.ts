import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import { ApiService } from '../api.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['postUserSignUp']);

    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.get(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validate()', () => {
    function validData() {
      return {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'Password1'
      };
    }

    it('returns error when firstName is empty', () => {
      component.signUpData = { ...validData(), firstName: '' };
      component.confirmPassword = 'Password1';
      expect(component.validate()).toMatch(/first name/i);
    });

    it('returns error when lastName is empty', () => {
      component.signUpData = { ...validData(), lastName: '' };
      component.confirmPassword = 'Password1';
      expect(component.validate()).toMatch(/last name/i);
    });

    it('returns error when email is invalid', () => {
      component.signUpData = { ...validData(), email: 'bad-email' };
      component.confirmPassword = 'Password1';
      expect(component.validate()).toMatch(/valid email/i);
    });

    it('returns error when password is too short', () => {
      component.signUpData = { ...validData(), password: 'Abc1' };
      component.confirmPassword = 'Abc1';
      expect(component.validate()).toMatch(/8 characters/i);
    });

    it('returns error when password has no number', () => {
      component.signUpData = { ...validData(), password: 'NoNumbers!' };
      component.confirmPassword = 'NoNumbers!';
      expect(component.validate()).toMatch(/letter and one number/i);
    });

    it('returns error when password has no letter', () => {
      component.signUpData = { ...validData(), password: '123456789' };
      component.confirmPassword = '123456789';
      expect(component.validate()).toMatch(/letter and one number/i);
    });

    it('returns error when passwords do not match', () => {
      component.signUpData = validData();
      component.confirmPassword = 'DifferentPassword1';
      expect(component.validate()).toMatch(/do not match/i);
    });

    it('returns empty string for valid data', () => {
      component.signUpData = validData();
      component.confirmPassword = 'Password1';
      expect(component.validate()).toBe('');
    });
  });

  describe('Post()', () => {
    it('sets errorMessage and does not call API when validation fails', () => {
      component.signUpData = {};
      component.confirmPassword = '';
      component.Post();
      expect(apiServiceSpy.postUserSignUp).not.toHaveBeenCalled();
      expect(component.errorMessage).toBeTruthy();
    });

    it('stores token and navigates on success', () => {
      component.signUpData = {
        firstName: 'Jane', lastName: 'Doe',
        email: 'jane@example.com', password: 'Password1'
      };
      component.confirmPassword = 'Password1';
      apiServiceSpy.postUserSignUp.and.returnValue(of({ token: 'mock-token' }));
      spyOn(localStorage, 'setItem');

      component.Post();

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
    });

    it('sets errorMessage from server on API error', () => {
      component.signUpData = {
        firstName: 'Jane', lastName: 'Doe',
        email: 'jane@example.com', password: 'Password1'
      };
      component.confirmPassword = 'Password1';
      apiServiceSpy.postUserSignUp.and.returnValue(
        throwError({ error: { message: 'An account with this email already exists.' } })
      );

      component.Post();

      expect(component.errorMessage).toBe('An account with this email already exists.');
    });

    it('sets fallback errorMessage when server error has no message', () => {
      component.signUpData = {
        firstName: 'Jane', lastName: 'Doe',
        email: 'jane@example.com', password: 'Password1'
      };
      component.confirmPassword = 'Password1';
      apiServiceSpy.postUserSignUp.and.returnValue(throwError({}));

      component.Post();

      expect(component.errorMessage).toBeTruthy();
    });
  });
});
