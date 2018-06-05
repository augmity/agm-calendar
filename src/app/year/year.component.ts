import { Component, OnInit, Input } from '@angular/core';


@Component({
  // tslint:disable-next-line
  selector: 'year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit {

  @Input() year: number;
  months: number[];

  constructor() { }

  ngOnInit() {
    this.months = Array.from({length: 12}, (v, k) => k + 1);
  }
}
