import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponse, AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;

    let authObs: Observable<AuthResponse> = this.authService.loginUser(
      email,
      password
    );

    authObs.subscribe({
      next: (res) => {
        console.log(res);
        if (res.data['role'] === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/employee']);
        }
        this.error = null;
      },
      error: (error) => {
        console.log(error.message);
        this.error = error.message;
      },
    });
  }
}
