import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterState,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;
      console.log('guard', isAuth, user);

      // if (user) {
      //   const { roles } = route.data;
      //   if (roles && !roles.includes(user.role)) {
      //     this.router.navigate(['/']);
      //     return false;
      //   }

      //   // authorized so return true
      //   return true;
      // }

      if (isAuth) {
        if (user['role'] === 'employee') {
        } else if (user['role'] === 'admin') {
        }
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
