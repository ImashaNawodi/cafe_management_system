import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SnackbarService } from './services/snackbar.service';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Correctly import the jwt-decode function
import { GlobalConstant } from './shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data.expectedRole as Array<string>;

    const token: any = localStorage.getItem('token');
    let tokenPayload: any;

    try {
      tokenPayload = jwtDecode(token); // Use the correctly imported function
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    let checkRole = expectedRoleArray.includes(tokenPayload.role);

    if (tokenPayload.role === 'user' || tokenPayload.role === 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackBar(GlobalConstant.unauthorized, GlobalConstant.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
