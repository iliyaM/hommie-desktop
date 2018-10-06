import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import * as moment from 'moment'

@Component({
  selector: 'app-screen-saver',
  templateUrl: './screen-saver.component.html',
  styleUrls: ['./screen-saver.component.scss']
})
export class ScreenSaverComponent implements OnInit {
  @Input() layout;

  sliderArray = [];
  currentActiveImage;
  activeIndex = 0;

  currentTime = moment().format('HH:MM  DD-mm-YYYY');

  mainiInterval;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getAllImages().subscribe(res => {
      if (res) {
        this.sliderArray.push(res);
      }
    })
    
    this.activateInterval();
  }
  
  activateInterval() {
    let slideIndex = 0;

    this.mainiInterval = setInterval(() => {
      let amount = this.sliderArray.length;

      if(slideIndex > 0) {
        this.sliderArray[slideIndex -1]['selected'] = false;
      }

      if(slideIndex === amount) {
        slideIndex = 0;
        this.sliderArray.forEach(item => item['selected'] = false);
      }

      this.sliderArray[slideIndex]['selected'] = true;
      slideIndex++;

    },7000)
  }

  // Loop with set time out on arra.
  // Add selected image to the dom each time.

  // Apply transition and shit randomnly each time to image and to text container.
  


}
