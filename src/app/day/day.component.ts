import { Component, OnInit, Input, HostBinding } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { EventsService } from '../events.service';
import { CalendarEvent } from '../models';


@Component({
  // tslint:disable-next-line
  selector: 'day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input() day: number;
  @Input() month: number;
  @Input() year: number;
  @Input() date: Date;
  @HostBinding('className') dayNameLowerCase: string;
  momentDate: moment.Moment;
  dayName: string;
  tooltipText: string;
  events: CalendarEvent[];
  hiddenCalendars: string[];
  visibleEvents: CalendarEvent[];

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    // Heads-up: the month value is zero-based (so January === 0)
    this.momentDate = moment({ year: this.year, month: this.month - 1, day: this.day });
    this.dayName = this.momentDate.format('dddd');
    this.dayNameLowerCase = this.dayName.toLowerCase();

    this.eventsService.source
      .pipe(
        // Get only the events that we are interested in
        map(items => {
          return items.filter(item => this.momentDate.isBetween(moment(item.from), moment(item.to), 'day', '[]'));
        })
      )
      .subscribe(items => {
        this.visibleEvents = items;
        this.tooltipText = items.map(item => item.name).join(', ');
      });
  }
}
