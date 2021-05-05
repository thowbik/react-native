import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../services/auth-service/authentication.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   throw new Error("Method not implemented.");
  // }
  
  constructor(public auth: AuthenticationService,private router:Router) {}
canActivate():boolean{
  // if(this.auth.isAuthenticated()){
  //   this.router.navigate(['page-route'])
  // }
  return this.auth.isAuthenticated();
}
}
