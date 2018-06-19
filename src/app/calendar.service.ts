import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { GoogleApiService } from 'ng-gapi';

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

  constructor(private gapiService: GoogleApiService) {
    console.log('cal init');


    // this.gapiService.onLoad().subscribe(() => {
    //   console.log('this.gapiService', this.gapiService);
    //   debugger;


    //   // gapi.client.calendar.events.list({
    //   //   'calendarId': 'primary',
    //   //   'timeMin': (new Date()).toISOString(),
    //   //   'showDeleted': false,
    //   //   'singleEvents': true,
    //   //   'maxResults': 10,
    //   //   'orderBy': 'startTime'
    //   // }).then(function(response) {
    //   //   var events = response.result.items;
    //   //   appendPre('Upcoming events:');

    //   //   if (events.length > 0) {
    //   //     for (i = 0; i < events.length; i++) {
    //   //       var event = events[i];
    //   //       var when = event.start.dateTime;
    //   //       if (!when) {
    //   //         when = event.start.date;
    //   //       }
    //   //       appendPre(event.summary + ' (' + when + ')')
    //   //     }
    //   //   } else {
    //   //     appendPre('No upcoming events found.');
    //   //   }
    //   // });
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


// Client ID	
// 675820247245-2gjuuqv10jn5be7au21ouh5aauqkhmml.apps.googleusercontent.com
// Client secret	
// ODcU8Em60J1mAzIAvlN15C_P
// Creation date	
// 31 May 2018, 12:50:52
// Name 

// agm-calendar
// Restrictions
// Enter JavaScript origins, redirect URIs or both


// https://console.developers.google.com/apis/credentials/oauthclient/675820247245-2gjuuqv10jn5be7au21ouh5aauqkhmml.apps.googleusercontent.com?project=glossy-protocol-205819&folder&organizationId