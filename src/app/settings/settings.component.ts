import { Component } from '@angular/core';

import { CalendarService } from '../calendar.service';
import { SettingsService } from '../settings.service';


@Component({
  selector: 'calendar-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(public calendarService: CalendarService, public settingsService: SettingsService) {}
}
