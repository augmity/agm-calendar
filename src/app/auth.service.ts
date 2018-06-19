import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi/lib/GoogleAuthService';
import GoogleUser = gapi.auth2.GoogleUser;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly SESSION_STORAGE_KEY: string = 'accessToken';
  private user: GoogleUser = undefined;

  constructor(private googleAuthService: GoogleAuthService,
              private ngZone: NgZone) {
  }

  public setUser(user: GoogleUser): void {
    this.user = user;
  }

  public getCurrentUser(): GoogleUser {
    return this.user;
  }

  public getToken(): string {
    const token: string = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY);
  }

  public signIn() {
    this.googleAuthService.getAuth().subscribe((auth) => {
        auth.signIn().then(res => this.signInSuccessHandler(res), err => this.signInErrorHandler(err));
    });
  }

  //TODO: Rework
  public signOut(): void {
      this.googleAuthService.getAuth().subscribe((auth) => {
          try {
              auth.signOut();
          } catch (e) {
              console.error(e);
          }
          sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
      });
  }

  public isUserSignedIn(): boolean {
    const accessToken = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    return (accessToken !== null);
  }

  private signInSuccessHandler(res: GoogleUser) {
      this.ngZone.run(() => {
          this.user = res;
          sessionStorage.setItem(
              this.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
          );
      });
  }

  private signInErrorHandler(err) {
      console.warn(err);
  }
}
