import { Component, OnInit } from '@angular/core';

import { CalendarService } from '../calendar.service';


@Component({
  selector: 'calendar-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public calendarService: CalendarService) { }

  ngOnInit() {
  }

}
