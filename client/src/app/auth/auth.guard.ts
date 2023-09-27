import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterState, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";

export const canActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
    const authService = inject(AuthService)
    const router = inject(Router)
    return authService.user.pipe(take(1), map(user => {
        const isAuth = !!user
        console.log("guard", isAuth, user)
        if (isAuth) {
            return true
        }

        return router.createUrlTree(['/login'])
    }))
}