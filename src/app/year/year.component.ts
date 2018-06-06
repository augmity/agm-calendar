import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';


@Component({
  // tslint:disable-next-line
  selector: 'year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit {

  @Input() year: number;
  @Input()
    set futureOnly(value: boolean) {
      const firstMonth = (value) ? moment().month() : 0;
      this.months = Array.from({length: 12 - firstMonth}).map((_, idx) => firstMonth + idx);
    }
  months: number[];

  ngOnInit() {
    this.months = Array.from({length: 12}, (v, k) => k + 1);
  }
}
