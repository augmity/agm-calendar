import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleAuthService, GoogleApiService } from 'ng-gapi';

import { SettingsService } from './settings.service';
import { CalendarService } from './calendar.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sidebarVisible = false;


  get isLoggedIn(): boolean {
    return (this.authService) ? this.authService.isUserSignedIn() : false;
  }

  constructor(public settingsService: SettingsService, private calendarService: CalendarService, private authService: AuthService,
    private httpClient: HttpClient,
    private gAuthService: GoogleAuthService,
    private gapiService: GoogleApiService) {

      this.gapiService.onLoad().subscribe();
      this.gAuthService.getAuth().subscribe((auth) => {
        console.log('Is SignedIn = ' + auth.isSignedIn.get());
      });
  }

  signIn() {
    this.authService.signIn();
  }

  load() {
    console.log('gapi', gapi);
    const calendarId = 'tdvqkp960stq38h1fq5os8c7ds@group.calendar.google.com';
    const uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    const authToken = this.authService.getToken();
    const requestOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${authToken}` }) };
    this.httpClient.get(uri, requestOptions)
      .subscribe(data => {
        console.log('data', data);
      });
  }
}


// export class AppComponent  {
//   public sheetId: string;
//   public sheet: any;
//   public foundSheet: any;



//   public create() {
//     this.sheetResource.create(this.userService.getToken())
//       .subscribe( res => this.sheet = res );
//   }

//   public findSheet() {
//     if (!this.sheetId) {
//       console.warn("no sheet id provided");
//       return;
//     }

//     this.sheetResource.findById(this.sheetId, this.userService.getToken())
//       .subscribe( res=> this.foundSheet = res);
//   }
// }
