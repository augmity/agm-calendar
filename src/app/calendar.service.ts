import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  constructor() {
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
