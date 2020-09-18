import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { RouteChangeData } from './models/route-change-data.interface';

@Injectable({
  providedIn: 'root'
})
export class NgRouteChangeService {
  readonly routeKeys = ['params', 'queryParams'];
  isData = false;
  isSentToHandler = false;
  data: RouteChangeData;
  prevState: Object;
  data$ = new ReplaySubject<RouteChangeData>(1);

  constructor(private router: Router) {
    this.clearData();
    this.subscribeToRouterEvents();
  }

  subscribeToRouterEvents() {
    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        this.setData(e.snapshot);
      } else if (e instanceof NavigationEnd) {
        this.data.state.url = e.url.startsWith('/') ? e.url.substr(1) : e.url;
        this.data.state.urlAfterRedirects = e.urlAfterRedirects.startsWith('/') ? e.urlAfterRedirects.substr(1) : e.urlAfterRedirects;
        this.setDataChanges();
        this.data$.next(this.data);
        this.clearData();
      }
    });
  }

  setData(snapshot) {
    this.isData = true;
    // this.data.state.outlet = snapshot.outlet;
    this.data.state.routeConfigPath = snapshot.routeConfig && snapshot.routeConfig.path || snapshot.routeConfig && snapshot.routeConfig.pathMatch || '';

    for (const routeKey of this.routeKeys) {
      const snapshotObj = snapshot[routeKey];
      const stateObj = this.data.state[routeKey];
      const snapshotKeys = Object.keys(snapshotObj);
      for (const key of snapshotKeys) {
        if (!stateObj.hasOwnProperty(key)) stateObj[key] = this.getValue(snapshotObj[key]);
      }
    }

    if (snapshot.data) this.data.state.data = snapshot.data;
  }

  clearData() {
    this.isData = false;
    this.isSentToHandler = false;
    this.prevState = {};
    this.routeKeys.forEach(token => this.prevState[token] = this.data && this.data.state[token] ? { ...this.data.state[token] } : null );

    this.data = {
      state: {
        url: '',
        urlAfterRedirects: '',
        // outlet: '',
        routeConfigPath: '',
        params: {},
        queryParams: {},
        data: undefined,
      },
      changes: {
        params: null,
        queryParams: null
      }
    };
  }

  setDataChanges() {
    this.routeKeys.forEach(key => {
      let stateObj = this.data.state[key];
      let prevStateObj = this.prevState[key];
      if (!stateObj && !prevStateObj) return;
      stateObj = stateObj || {};
      prevStateObj = prevStateObj || {};
      const changes = this.data.changes;
      const allProps = { ...stateObj, ...prevStateObj };
      changes[key] = {};
      for (const prop in allProps) {
        if (stateObj[prop] !== prevStateObj[prop]) {
          const value = this.getValue(stateObj[prop]);
          changes[key][prop] = {};
          if (value !== undefined) changes[key][prop].value = this.getValue(value);
          if (prevStateObj[prop] !== undefined) changes[key][prop].oldValue = this.getValue(prevStateObj[prop]);
        }
      }
    });
  }

  getData(): ReplaySubject<RouteChangeData> {
    return this.data$;
  }

  getValue(value) {
    return typeof(value) === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  }
}
