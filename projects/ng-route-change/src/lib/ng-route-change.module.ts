import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgRouteChangeDirective } from './ng-route-change.directive';
import { NgRouteChangeService } from './ng-route-change.service';

@NgModule({
  declarations: [
    NgRouteChangeDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    NgRouteChangeService
  ],
  exports: [
    NgRouteChangeDirective
  ]
})
export class NgRouteChangeModule {}
