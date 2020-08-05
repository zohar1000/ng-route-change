
/**********************************************************************************************************************/
/* the directive sends the component info on each route change.
/* it calls a component function at each route change and sends:
/* 1. route state - current url, params and query params
/* 2. changes in params and query params made from last route
/*
/* to operate the directive, place it on <ng-container> element or any other element in your template
/* and pass to it an object with 2 parameters, handler and host:
/*   <ng-container [CmrRouteChange]="{ handler: onRouteChange, host: this }"></ng-container>
/*   handler - the function name in the component that will receive the data
/*   host - this should always be: this
/*
/* the handler function is called with a parameter of type RouteChangeData
/**********************************************************************************************************************/

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { NgRouteChangeService } from './ng-route-change.service';
import { RouteChangeData } from './models/route-change-data.interface';

@Directive({
  selector: '[NgRouteChange]'
})
export class NgRouteChangeDirective implements OnInit, OnDestroy {
  @Input('NgRouteChange') directiveParams;
  subscription;

  constructor(private service: NgRouteChangeService) {}

  ngOnInit() {
    this.subscription = this.service.getData().subscribe((data: RouteChangeData) => {
      if (this.directiveParams) {
        this.directiveParams.handler.call(this.directiveParams.host, data);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) this.subscription.unsubscribe();
  }
}
