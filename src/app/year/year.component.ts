import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';


export interface MonthYear {
  month: number;
  year: number
}


@Component({
  // tslint:disable-next-line
  selector: 'year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnChanges  {

  @Input() year: number;
  @Input() futureOnly = false;

  items: MonthYear[];

  ngOnChanges () {
    console.log('this.year', this.year);
    console.log('this.futureOnly', this.futureOnly);

    if (this.year) {
      const firstMonth = (this.futureOnly) ? moment().month() : 0;
      this.items = Array
        .from({length: 12 - firstMonth})
        .map((_, idx) => (
          {
            month: firstMonth + 1 + idx,
            year: this.year
          }
        ));
    }
  }

  trackByUid(index: number, value: MonthYear) {
    return value.year * 100 + value.month;
  }
}
