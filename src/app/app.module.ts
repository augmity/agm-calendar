import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from 'ng-gapi';
import { SatPopoverModule } from '@ncstate/sat-popover';

import { SharedModule } from './shared';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { SettingsComponent } from './settings/settings.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { environment } from '../environments/environment';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: environment.gapi.clientId,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly',
  ].join(' ')
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    SatPopoverModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    DayComponent,
    MonthComponent,
    YearComponent,
    SettingsComponent,
    YearSelectorComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
