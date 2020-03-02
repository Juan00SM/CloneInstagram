import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';

@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  constructor(private vibration: Vibration) { }
  vibrate(time1: number = 1300, time2?: number, time3?: number){
    this.vibration.vibrate([time1,time2,time3]);
  }
}