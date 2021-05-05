import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {api_url} from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Platform, Events } from '@ionic/angular';
import * as jwt from 'jwt-decode'
import { IonicStorageService } from '../ionic-storage/ionic-storage.service';
import { Storage } from '@ionic/storage';


const token_key="user_token"
const logged_username="logged_username"
const username="username"

const apiUrl = api_url;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

   authenticationState= new BehaviorSubject(false);
   headers = new HttpHeaders();

  constructor(private http:HttpClient,public ionicStore: IonicStorageService,private plt:Platform,private events:Events,private storage: Storage) { 
    this.plt.ready().then(()=>{
      this.checkToken();
    })
  }
  createAuthorizationHeader(headers: HttpHeaders) {    
    // headers.append('Authorization', 'application/json');
    headers.append('Accept', 'application/json');
     headers.append('Authorization', 'emis_dev');
     
  }

  login(data): Observable<any> {
    
    this.createAuthorizationHeader(this.headers);
 
    return this.http.post<any>(apiUrl + 'auth', data, {headers: this.headers
    })
    .pipe(
      tap(res => { 
        this.log('login')
       
        let token=res.token
        // let parsedValue=JSON.parse(res.token)
        let decoded = jwt(token)
      this.authenticationState.next(true);
     
      localStorage.setItem(token_key,res.token);
      localStorage.setItem(username,data.username);

      if(res.userdata.username){
        this.events.publish('user:signedIn',
          localStorage.setItem(logged_username, res.userdata.username)
  );
      // localStorage.setItem(logged_username,res.userdata.username)
      }
    }),
      catchError(this.handleError('login', []))
    );
  }
  checkToken() {
  let value=localStorage.getItem(token_key)
    if(value){
      this.authenticationState.next(true)
    }
    // return this.authenticationState.value
 // this.authenticationState.next(true)
  }
  getTokenDetails() {
    let value=localStorage.getItem(token_key)
    let decoded_token
    if(value){
       decoded_token=jwt(value)
    }
    return decoded_token
  }
  
 
  logout() {
    this.authenticationState.next(false);
    // this.ionicStore.removeStoreData();
    // this.ionicStore.removeFinalData();
    this.storage.clear();
    localStorage.clear();

  }
  isAuthenticated() {
    return this.authenticationState.value
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
  }
}
