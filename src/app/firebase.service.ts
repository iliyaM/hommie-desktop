import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { combineLatest, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private fireStore: AngularFirestore, private afStorage: AngularFireStorage) { }

  listenToScreenSelection() {
    return this.fireStore.collection('currenScreenAndLayout').doc('123').valueChanges();
  }

  // Get account info
  listenToAccountCollection(month) {
    const regular = this.fireStore.collection('iliya-account').doc(month).collection('regular').valueChanges()
    const constant = this.fireStore.collection('iliya-account').doc(month).collection('constant').valueChanges()
    const loans = this.fireStore.collection('iliya-account').doc(month).collection('loans').valueChanges()
    const savings = this.fireStore.collection('iliya-account').doc(month).collection('savings').valueChanges()
    const sallary = this.fireStore.collection('iliya-account').doc(month).collection('sallary').valueChanges()


    this.fireStore.collection('iliya-account').doc(month).get().forEach
    return combineLatest(regular, constant, loans, savings, sallary);
  }

  // Get Constant collection 
  listenToConstantCollection() {
    return this.fireStore.collection('iliya-account').doc('constant').collection('remove').valueChanges();
  }

  // Get notifications
  listenToNotifications() {
    return this.fireStore.collection('notifications').valueChanges();
  }


  // Images
  getAllImages() {
    const images = new BehaviorSubject(null);

    this.fireStore.collection('iliya-images').valueChanges().subscribe(res => {
      res.forEach(item => {
        images.next({url: this.afStorage.ref(`iliya/${item['imageUrl']}`).getDownloadURL(), desc: item['desc'], selected: false });
      });
    })
    return images;
  }

  // Get Globals
  getGlobals(docId) {
    return this.fireStore.collection('iliya-account-globals').doc(docId).valueChanges();
  }

  // Update Acccount Globals
  updateGlobal(doc, obj) {
    this.fireStore.collection('iliya-account-globals').doc(doc).update(obj);
  }
}
