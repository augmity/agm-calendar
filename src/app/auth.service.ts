import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GoogleAuthService } from 'ng-gapi/lib/GoogleAuthService';
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly SESSION_STORAGE_KEY: string = 'accessToken';
  private userSubject = new BehaviorSubject<GoogleUser>(null);
  private tokenSubject = new BehaviorSubject<string>(null);
  private auth: GoogleAuth;
  private _user: GoogleUser;

  user$ = this.userSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  get user(): GoogleUser {
    return this._user;
  }
  set user(value: GoogleUser) {
    this._user = value;

    if (value) {
      const token = value.getAuthResponse().access_token;
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, token);
      this.userSubject.next(value);
      this.tokenSubject.next(token);
    } else {
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
      this.userSubject.next(null);
      this.tokenSubject.next(null);
    }
  }

  constructor(private googleAuthService: GoogleAuthService) {
    this.googleAuthService.getAuth()
      .subscribe((auth) => {
        this.auth = auth;
        if (this.auth.isSignedIn) {
          const user = this.auth.currentUser.get();
          // Because change detection needs a milisecond
          setTimeout(() => {
            this.user = user;
          }, 1);
        }
      });
  }

  getCurrentUser(): GoogleUser {
    return this.user;
  }

  getToken(): string {
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY);
  }

  signIn() {
    this.auth.signIn().then(this.signInSuccessHandler.bind(this), this.signInErrorHandler.bind(this));
  }

  signOut(): void {
    if (this.auth) {
      this.auth.signOut();
      this.user = null;
    }
  }

  isUserSignedIn(): boolean {
    const accessToken = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    return (accessToken !== null);
  }

  private signInSuccessHandler(user: GoogleUser) {
    this.user = user;
  }

  private signInErrorHandler(err) {
    console.error(err);
  }
}
