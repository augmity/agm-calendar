import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { GoogleApiService } from 'ng-gapi';

import { AuthService } from './auth.service';
import { Calendar, CalendarEvent } from './models';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  events = new BehaviorSubject<CalendarEvent[]>([]);
  calendars = new BehaviorSubject<Calendar[]>([]);
  visibleCalendars = new BehaviorSubject<string[]>([]);
  private visibleCalendarsValue: string[];
  private cachedEvents: CalendarEvent[];
  private cachedCalendars: Calendar[];

  constructor(private gapiService: GoogleApiService, private httpClient: HttpClient, private authService: AuthService) {
    console.log('cal init');

    combineLatest(
      this.gapiService.onLoad(),
      this.authService.user$
    )
    .subscribe(([loaded, user]) => {
      console.log('data', loaded, user);
      if (user) {
        const token = this.authService.getToken();
        console.log('token', token);
      }
    });

    // this.gapiService.onLoad().subscribe(_ => {
    //   const calendarId = 'tdvqkp960stq38h1fq5os8c7ds@group.calendar.google.com';
    //   const uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    //   const authToken = this.authService.getToken();
    //   const requestOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${authToken}` }) };
    //   this.httpClient.get(uri, requestOptions)
    //     .subscribe(data => {
    //       console.log('data 2', data);
    //     });
    // });

    this.cachedEvents = [
      {
        calendarId: '1',
        color: '#f00',
        from: new Date(2018, 5, 2),
        to: new Date(2018, 5, 15),
        name: 'test #1'
      },
      {
        calendarId: '2',
        color: '#f3c731',
        from: new Date(2018, 5, 11),
        to: new Date(2018, 5, 21),
        name: 'test #2'
      },
    ];

    this.cachedCalendars = [
      {
        id: '1',
        name: 'cal #1',
        color: '#f00'
      },
      {
        id: '2',
        name: 'cal #2',
        color: '#f3c731'
      },
    ];

    this.events.next(this.cachedEvents);
    this.calendars.next(this.cachedCalendars);
    this.visibleCalendarsValue = this.cachedCalendars.map(item => item.id);
    this.visibleCalendars.next(this.visibleCalendarsValue);
  }

  setCalendarVisibility(id: string, visible: boolean) {
    // Update visible calendars
    const idx = this.visibleCalendarsValue.indexOf(id);
    if (visible && (idx < 0)) {
      this.visibleCalendarsValue = [...this.visibleCalendarsValue, id];
    }
    if (!visible && (idx > -1)) {
      this.visibleCalendarsValue = this.visibleCalendarsValue.filter(item => item !== id);
    }
    this.visibleCalendars.next(this.visibleCalendarsValue);

    // Update events
    const events = this.cachedEvents.filter(item => {
      return this.visibleCalendarsValue.indexOf(item.calendarId) > -1;
    });
    this.events.next(events);
  }
}

// https://console.developers.google.com/apis/credentials/oauthclient/675820247245-2gjuuqv10jn5be7au21ouh5aauqkhmml.apps.googleusercontent.com?project=glossy-protocol-205819&folder&organizationId