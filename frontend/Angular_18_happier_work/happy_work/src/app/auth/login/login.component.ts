import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})

export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
   }

  getRequiredError(key: any): any {
    return this.loginForm.controls[key].hasError('required');
  }

  getValidationErrors(key: any): any {
    return (
      (this.loginForm.controls[key].touched ||
        this.loginForm.controls[key].dirty) &&
      this.loginForm.controls[key].errors
    );
  }

  getFormControlValue(key: any): any {
    return this.loginForm.get(key)?.value;
  }

  login(): void {
    let userData: any = {
      email: this.getFormControlValue('email'),
      password: this.getFormControlValue('password'),
    };
    this.authService.login(userData).pipe(take(1))
      .subscribe((userDetails) => {
        this.authService.setToken(userDetails.access);
        this.router.navigate(['/project/list']);
      });
  }
}
