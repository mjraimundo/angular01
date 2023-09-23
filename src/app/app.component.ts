import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  isHome = false

  constructor( private router: Router,) {}

  ngOnInit() {
     this.router.events.subscribe(e => {
        if (e instanceof NavigationStart) {
          this.isHome =  e.url === '/'
          //if (e.url === '/') this.isHome = true
        }
      });
    }
  }
