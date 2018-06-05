import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';


@Component({
  // tslint:disable-next-line
  selector: 'month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit {

  @Input() month: number;
  @Input() year: number;
  days: number[];
  monthName: string;

  constructor() {}

  ngOnInit() {
    const momentDate = moment({ year: this.year, month: this.month - 1 })
    const daysInMonth = momentDate.daysInMonth();
    this.monthName = momentDate.format('MMMM');
    this.days = Array.from({length: daysInMonth}, (v, k) => k + 1);
  }
}
