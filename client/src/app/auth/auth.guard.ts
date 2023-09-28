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
export const loginGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
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
  state: RouterStateSnapshot
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

const checkUserLogin = (route: ActivatedRouteSnapshot, url: any): boolean => {

  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated) {
    const userRole = authService.getRole();

    if (route.data.role && route.data.role.indexOf(userRole) === -1) {
      router.navigate(['/home']);
      return false;
    }
    return true;
  }

  router.navigate(['/home']);
  return false;
}

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) { }

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return authService.user.pipe(
//       take(1),
//       map((user) => {
//         const isAuth = !!user;
//         console.log(user)
//         console.log('guard', isAuth, user);

//         if (isAuth) {
//           let url: string = state.url;
//           return checkUserLogin(next, url, user);
//         }

//         router.navigate(['/login']);
//         return false
//       })
//     );
//   }

//   checkUserLogin(route: ActivatedRouteSnapshot, url: any, user: User): boolean {
//     // const userRole = user.role;
//     // if (route.data.role && route.data.role.indexOf(userRole) === -1) {
//     //   router.navigate(['/home']);
//     //   return false;
//     // }
//     return true;
//   }
// }