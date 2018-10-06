import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import * as moment from 'moment';
import { groupFlyInAnimation } from '../animations';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [groupFlyInAnimation]
})

export class AccountComponent implements OnInit, OnChanges {
  @Input() layout;
  @Input() month;
  currentMonth = moment().format('MM-YYYY');

  regularExpanses;
  regularExpansesSum = 0;

  constantExpanses;
  constantExpansesSum = 0;

  totalSum;

  loans;
  showLoans;

  savings;
  showSavings;

  isChecked;

  sallary;
  sallaryItem;

  currentSum;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.getGlobals();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.month.currentValue) {
      this.currentMonth = changes.month.currentValue;
      this.getData();
    }
  }

  getGlobals() {
    this.firebaseService.getGlobals(this.currentMonth).subscribe(res => {
      if (res) {
        this.showLoans = res['loans']
        this.showSavings = res['savings']

        this.isChecked = res['isChecked']
        this.currentSum = res['currentSum'];
      }
    })
  }

  getData() {

    this.firebaseService.listenToAccountCollection(this.currentMonth).subscribe(res => {

      if (res) {
        // Combine all collection.
        let merged = [].concat.apply([], res);

        // Clear out old values;
        this.regularExpanses = [];
        this.constantExpanses = [];
        this.regularExpansesSum = 0;
        this.constantExpansesSum = 0;

        // Speat by modifier
        merged.forEach(item => {
          if (item.modifier === 'regular') {
            this.regularExpanses.push(item)
            this.regularExpansesSum += Number(item.value)
          }

          if (item.modifier === 'constant') {
            this.constantExpanses.push(item)
          }


          if (item.modifier === 'sallary') {
            this.sallary = Number(item.value);
            this.sallaryItem = item;
          }

          if (item.modifier === 'loans') {

            if (!this.isChecked) {
              this.showLoans -= Number(item.value);
            }

            this.constantExpanses.push(item);
            this.constantExpansesSum += Number(item.value)
          }

          if (item.modifier === 'savings') {
            if (!this.isChecked) {
              this.showSavings -= Number(item.value)
            }

            this.constantExpanses.push(item)
            this.constantExpansesSum += Number(item.value)
          }

        });
        this.calculateSum();
      }
    });
  }

  calculateSum() {
    this.totalSum = (this.currentSum + this.sallary) - (this.constantExpansesSum + this.regularExpansesSum);

    // Update only once with current values;
    if (!this.isChecked) {

      let obj = {
        isChecked: true,
        loans: this.showLoans,
        savings: this.showSavings
      }
      this.firebaseService.updateGlobal(this.currentMonth, obj);
    } 
  }
}
