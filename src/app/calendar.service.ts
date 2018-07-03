import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { map, mergeAll, mergeMap } from 'rxjs/operators';
import { GoogleApiService } from 'ng-gapi';

import { AuthService } from './auth.service';
import { Calendar, CalendarEvent } from './models';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private calendarsSubject = new BehaviorSubject<Calendar[]>([]);
  private visibleCalendarsSubject = new BehaviorSubject<string[]>([]);
  private token: string;
  private visibleCalendarsValue: string[];
  private cachedEvents: CalendarEvent[];
  events = this.eventsSubject.asObservable();
  calendars = this.calendarsSubject.asObservable();
  visibleCalendars = this.visibleCalendars.asObservable();

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
    this.visibleCalendarsSubject.next(this.visibleCalendarsValue);

    // Update events
    const events = this.cachedEvents.filter(item => {
      return this.visibleCalendarsValue.indexOf(item.calendarId) > -1;
    });
    this.eventsSubject.next(events);
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
        this.calendarsSubject.next(calendars);
        this.visibleCalendarsValue = calendars.map(item => item.id);
        this.visibleCalendarsSubject.next(this.visibleCalendarsValue);

        this.loadEvents();
      });
  }

  private loadEvents() {
    const calendars = [
      { id: '86irpg9cud4qq81kqq7rgoh67c@group.calendar.google.com', color: '#fa573c' },
      { id: 'tdvqkp960stq38h1fq5os8c7ds@group.calendar.google.com', color: '#fad165' }
    ];

    of(calendars)
      .pipe(
        mergeAll(),
        mergeMap(calendar => this.getCalendarEvents(calendar.id, calendar.color))
      )
      .subscribe(events => {
        console.log('events', events);
        this.cachedEvents = (this.cachedEvents) ? this.cachedEvents.concat(events) : events;
        this.eventsSubject.next(this.cachedEvents);
      });
  }

  private getCalendarEvents(calendarId: string, calendarColor: string): Observable<CalendarEvent[]> {
    const uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    const requestOptions = { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) };
    return this.httpClient
      .get(uri, requestOptions)
      .pipe(
        map((data: gapi.client.calendar.Events) => {
          if (data && data.items) {
            return data.items.map(item => {
              return {
                calendarId: calendarId,
                color: calendarColor,
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