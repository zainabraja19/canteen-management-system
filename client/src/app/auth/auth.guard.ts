import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterState,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { User } from './user.model';

// If user can access auth routes or not
export const loginGuard: CanActivateChildFn = ():
  | boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> => {

  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated) {
    if (authService.getRole() === 'employee') {
      router.navigate(['/employee'])
    } else if (authService.getRole() === 'admin') {
      router.navigate(['/admin'])
    }
    return false;
  }
  return true;
};

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
):
  | boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> => {


  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated) {
    const userRole = authService.getRole();

    if (route.data.role && route.data.role.indexOf(userRole) === -1) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  router.navigate(['/']);
  return false;
};