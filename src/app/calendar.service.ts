import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';
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
  private token: string;
  private visibleCalendarsValue: string[];
  private cachedEvents: CalendarEvent[];
  private cachedCalendars: Calendar[];

  constructor(private gapiService: GoogleApiService, private httpClient: HttpClient, private authService: AuthService) {
    combineLatest(
      this.gapiService.onLoad(),
      this.authService.token$
    )
    .subscribe(([loaded, token]) => {
      if (token) {
        console.log('token', token);
        this.token = token;
        this.loadCalendars();
      }
    });

    // this.cachedEvents = [
    //   {
    //     calendarId: '1',
    //     color: '#f00',
    //     from: new Date(2018, 5, 2),
    //     to: new Date(2018, 5, 15),
    //     name: 'test #1'
    //   },
    //   {
    //     calendarId: '2',
    //     color: '#f3c731',
    //     from: new Date(2018, 5, 11),
    //     to: new Date(2018, 5, 21),
    //     name: 'test #2'
    //   },
    // ];

    // this.cachedCalendars = [
    //   {
    //     id: '1',
    //     name: 'cal #1',
    //     color: '#f00'
    //   },
    //   {
    //     id: '2',
    //     name: 'cal #2',
    //     color: '#f3c731'
    //   },
    // ];

    // this.events.next(this.cachedEvents);
    // this.calendars.next(this.cachedCalendars);
    // this.visibleCalendarsValue = this.cachedCalendars.map(item => item.id);
    // this.visibleCalendars.next(this.visibleCalendarsValue);
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

  private loadCalendars() {
    const uri = `https://www.googleapis.com/calendar/v3/users/me/calendarList`;
    const requestOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) };
    this.httpClient
      .get(uri, requestOptions)
      .pipe(
        map((data: gapi.client.calendar.CalendarList) => {
          if (data && data.items) {
            return data.items.map(item => {
              return {
                id: item.id,
                name: item.summary,
                color: item.backgroundColor
              };
            });
          }
        })
      )
      .subscribe((calendars: Calendar[]) => {
        console.log('cals 2', calendars);
        this.cachedCalendars = calendars;
        this.calendars.next(this.cachedCalendars);
        this.visibleCalendarsValue = this.cachedCalendars.map(item => item.id);
        this.visibleCalendars.next(this.visibleCalendarsValue);

        this.loadEvents();
      });
  }

  private loadEvents() {
    const calendars = [
      '86irpg9cud4qq81kqq7rgoh67c@group.calendar.google.com',
    ];
    const calendarId = 'tdvqkp960stq38h1fq5os8c7ds@group.calendar.google.com';

    const calendarColor = '#f00';
    this.getCalendarEvents(calendarId)
      .pipe(
        map(data => data.map(item => Object.assign(item, { calendarId: calendarId, color: calendarColor })))
      )
      .subscribe(events => {
        console.log('events', events);
        this.cachedEvents = (this.cachedEvents) ? this.cachedEvents.concat(events) : events;
        this.events.next(this.cachedEvents);
      });
  }

  private getCalendarEvents(calendarId: string): Observable<CalendarEvent[]> {
    const uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    const requestOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) };
    return this.httpClient
      .get(uri, requestOptions)
      .pipe(
        map((data: gapi.client.calendar.Events) => {
          if (data && data.items) {
            return data.items.map(item => {
              return {
                from: new Date(item.start.date || item.start.dateTime),
                to: new Date(item.end.date || item.end.dateTime),
                name: item.summary
              } as CalendarEvent;
            });
          }
        })
      );
  }

}

// https://console.developers.google.com/apis/credentials/oauthclient/675820247245-2gjuuqv10jn5be7au21ouh5aauqkhmml.apps.googleusercontent.com?project=glossy-protocol-205819&folder&organizationId