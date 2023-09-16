import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSource = new BehaviorSubject(true)
  isConfig = this.messageSource.asObservable()
  
  constructor() { }

  changeConfig(value: boolean) {
    this.messageSource.next(value)
  }
}
