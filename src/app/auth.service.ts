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
  private user: GoogleUser;
  private auth: GoogleAuth;

  user$ = this.userSubject.asObservable();

  constructor(private googleAuthService: GoogleAuthService) {
    this.googleAuthService.getAuth()
      .subscribe((auth) => {
        this.auth = auth;
        if (this.auth.isSignedIn) {
          this.user = this.auth.currentUser.get();
          // Because change detection needs a milisecond
          setTimeout(() => {
            this.userSubject.next(this.user);
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
      try {
        this.auth.signOut();
        sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
        this.userSubject.next(null);
      } catch (e) {
        console.error(e);
      }
    }
  }

  isUserSignedIn(): boolean {
    const accessToken = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    return (accessToken !== null);
  }

  private signInSuccessHandler(user: GoogleUser) {
    this.user = user;
    this.userSubject.next(user);
    sessionStorage.setItem(this.SESSION_STORAGE_KEY, user.getAuthResponse().access_token);
  }

  private signInErrorHandler(err) {
    console.error(err);
  }
}
