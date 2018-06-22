import { Component } from '@angular/core';
import GoogleUser = gapi.auth2.GoogleUser;

import { SettingsService } from './settings.service';
import { CalendarService } from './calendar.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  user: GoogleUser;
  sidebarVisible = false;

  get isLoggedIn(): boolean {
    return (this.authService) ? this.authService.isUserSignedIn() : false;
  }

  constructor(public settingsService: SettingsService, private calendarService: CalendarService, private authService: AuthService) {
    this.authService.user$.subscribe(user => this.user = user);
  }

  signIn() {
    this.authService.signIn();
  }

  signOut() {
    this.authService.signOut();
  }
}
