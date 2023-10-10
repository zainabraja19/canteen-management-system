import {
    HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, tap, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponse {
    data: {};
    error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    isAuthenticated: Boolean;
    role: string;
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    // Inject httpclient
    constructor(private http: HttpClient, private router: Router) { }

    signupUser(
        empId: string,
        name: string,
        email: string,
        phone: string,
        password: string
    ) {
        return this.http
            .post<AuthResponse>(
                'http://localhost:3000/auth/signup',
                { empId, name, email, phone, password }
            )
            .pipe(
                catchError(this.handleError),
            );
    }

    // Login user
    loginUser(email: string, password: string) {
        // Call login API
        return this.http
            .post<AuthResponse>(
                'http://localhost:3000/auth/login',
                { email, password }
            )
            .pipe(
                catchError(this.handleError),
                tap((response) => {
                    return this.handleAuthentication(response);
                })
            );
    }

    autoLogin() {
        const userData: {
            empId: string,
            name: string,
            email: string,
            phone: string,
            role: string,
            _id: string,
            expiresIn: Date
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.empId,
            userData.name,
            userData.email,
            userData.phone,
            userData.role,
            userData._id,
            userData.expiresIn
        );
        this.isAuthenticated = true
        this.role = userData.role
        this.user.next(loadedUser);
    }

    logoutUser() {
        this.http.get('http://localhost:3000/auth/logout').subscribe((res) => {
            this.isAuthenticated = false;
            this.user.next(null);
            this.router.navigate(['/auth/login']);
            localStorage.removeItem('userData');

            if (this.tokenExpirationTimer) {
                clearTimeout(this.tokenExpirationTimer);
            }
            this.tokenExpirationTimer = null;
        });
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logoutUser();
        }, expirationDuration);
    }

    getRole() {
        this.role = JSON.parse(localStorage.getItem('userData')).role
        return this.role;
    }

    private handleAuthentication(response) {
        const { email, empId, name, phone, role, _id, expiresIn } = response.data;

        const user = new User(email, empId, name, phone, role, _id, new Date(expiresIn));

        const expirationDuration = new Date(expiresIn).getTime() - new Date().getTime() - 100

        this.user.next(user);
        this.autoLogout(expirationDuration);

        localStorage.setItem('userData', JSON.stringify(response.data));

        this.isAuthenticated = true;
        this.user.next(user);
    }

    private handleError(errorRes) {
        let errorMessage = 'An error occurred. Please try again!'
        let error = errorRes.error.error

        let fields = {
            empId: '',
            name: '',
            email: '',
            phone: '',
            password: ''
        }

        if (error) {
            errorMessage = error
            Object.keys(fields).map(field => {
                if (error[field]) {
                    errorMessage = error[field]
                }
            })
            return throwError(() => new Error(errorMessage));

        }
        return throwError(
            () => new Error(errorMessage)
        );
    }
}
