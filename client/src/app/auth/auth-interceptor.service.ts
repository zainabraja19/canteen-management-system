import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        const user = localStorage.getItem('userData')
        console.log("Interceptor", user)
        if (user) {
            console.log("in if");

            // Check and log the headers being sent
            console.log("Headers:", headers);

            const cloned = req.clone({
                headers,
                withCredentials: true
            });

            // Log the cloned request
            console.log("Cloned Request:", cloned);

            return next.handle(cloned);
        } else {
            console.log("in else");

            // Log the original request
            console.log("Original Request:", req);

            return next.handle(req);
        }

    }
}