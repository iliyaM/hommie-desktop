import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  selectedLayout;
  selectedScreen;
  accountMonth;
  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.listenToScreenSelection().subscribe(response => {
      if(response) {
        this.selectedLayout = response['selectedLayout'];
        this.selectedScreen = response['selectedScreen'];
        this.accountMonth = response['selectedMonth'];
      }
    })
  }
}
