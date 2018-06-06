import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared';

import { AppComponent } from './app.component';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { SettingsComponent } from './settings/settings.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
export class AppModule { }
