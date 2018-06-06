import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';


const YEAR_SELECTOR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => YearSelectorComponent),
  multi: true
};


@Component({
  selector: 'year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss'],
  providers: [YEAR_SELECTOR_CONTROL_VALUE_ACCESSOR],
})
export class YearSelectorComponent implements OnInit {

  @Input() disabled = false;
  @Input() yearsBeforeAfter = 2;
  years: number[];
  @Input()
    get selectedYear(): number {
      return this._selectedYear;
    }
    set selectedYear(value: number) {
      if (value) {
        this._selectedYear = value;
        this.onChangeCallback(value);
      }
    }

  private _selectedYear: number;
  // Placeholders for the callbacks
  private onTouchedCallback: (_: any) => void;
  private onChangeCallback: (_: any) => void;

  constructor() { }

  ngOnInit() {
    this._selectedYear = moment().year();
    this.years = Array.from({length: 2 * this.yearsBeforeAfter + 1 }).map((_, idx) => this.selectedYear - this.yearsBeforeAfter + idx);
  }

  //
  //  ControlValueAccessor interface implementation
  // -------------------------------------------------

  writeValue(value: any) {
    if (value) {
      this._selectedYear = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
