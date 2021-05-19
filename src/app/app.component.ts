import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-boilerplate';

  // Get Child - Activated Route
  getChild(ActivatedRoute: ActivatedRoute): any {
    if (ActivatedRoute.firstChild) {
      return this.getChild(ActivatedRoute.firstChild);
    } else {
      return ActivatedRoute;
    }
  }

  // Set Title dynamically based on route
  setPageTitle(): void {
    this.Router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(() => {
      const x = this.getChild(this.ActivatedRoute);
      x.data.subscribe((data: { title: string; description: string; url: string }) => {
        // Set Title
        this.Title.setTitle(`${data.title ? data.title + ' — ' : ''} Angular Boilerplate`);
      });
    });
  }

  constructor(private Router: Router, private ActivatedRoute: ActivatedRoute, private Title: Title) {}

  ngOnInit(): void {
    this.setPageTitle();
  }
}
