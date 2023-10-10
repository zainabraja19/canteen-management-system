import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Check if user is already logged in
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

// Check if user is authorized to view routes
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