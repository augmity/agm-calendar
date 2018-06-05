import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CalendarEvent } from './models';


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  source = new BehaviorSubject<CalendarEvent[]>([]);

  constructor() {
    this.source.next([
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
    ]);
  }
}
