import { Component, OnInit, Input } from '@angular/core';
import { groupFlyInAnimation } from '../animations';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [groupFlyInAnimation]
})
export class NotificationsComponent implements OnInit {
  @Input() layout;
  notifications;
  notificationColors = ['#7afcff', '#feff9c', '#fff740', '#ff7455', '#1ba8b1', '#fffeaa', '#ff0079', '#dcff46'];

  constructor(private firebaseService: FirebaseService) { }


  ngOnInit() {
    this.firebaseService.listenToNotifications().subscribe(res => {
      if (res) {
        this.notifications = res;
      }
    })
  }


  randomizeAll() {
    let colorAmount = this.notificationColors.length;
    let randomNumber = Math.floor(Math.random() * (7 - 0 + 1) + 0);
    let rotation = Math.floor(Math.random() * (10 - 0 + 1) + 0);
    return  {
      'background-color': this.notificationColors[randomNumber],
      'transform': `rotate(${rotation}deg)`,
    }
  }
}
