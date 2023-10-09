import { Component } from '@angular/core';
import { AuthResponse, AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  error: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { empId, name, email, phone, password } = form.value;

    let authObs: Observable<AuthResponse> = this.authService.signupUser(
      empId,
      name,
      email,
      phone,
      password
    );

    authObs.subscribe({
      next: (res) => {
        this.router.navigate(['/auth/login']);
        this.error = null;
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
