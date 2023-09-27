import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError, tap, Subject, BehaviorSubject } from "rxjs";
import { User } from "./user.model";

export interface AuthResponse {
    data: {},
    error?: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    isAuthenticated: Boolean
    user = new BehaviorSubject<User>(null)
    // Inject httpclient
    constructor(private http: HttpClient, private router: Router) { }
    // Login user
    loginUser(email: string, password: string) {
        // Call login API
        return this.http.post<AuthResponse>('http://localhost:3000/auth/login', { email, password }, { withCredentials: true })
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    return this.handleAuthentication(response)
                }))
    }

    logoutUser() {
        this.http.get('http://localhost:3000/auth/logout').subscribe(res => {
            console.log(res)
            this.isAuthenticated = false
            this.user.next(null)
            this.router.navigate(['/login']);
            localStorage.removeItem('userData');

        })
    }

    private handleAuthentication(response) {
        console.log("res", response)
        const { email, empId, name, phone, role, _id } = response.data

        const user = new User(email, empId, name, phone, role, _id);

        localStorage.setItem('userData', JSON.stringify(response.data))

        this.isAuthenticated = true

        this.user.next(user)
    }

    private handleError(errorRes) {
        // let errorMessage = 'An error occurred. Please try again!';
        console.log(errorRes);
        if (!errorRes.message) {
            return throwError(() => new Error('An error occurred. Please try again!'));
        }
        return throwError(() => new Error('An error occurred. Please try again!'));

        // return throwError(() => new Error(errorRes.message));
    }
}