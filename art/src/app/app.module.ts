import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ExhibitDetailsComponent } from './exhibit-details/exhibit-details.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { LiveartListComponent } from './liveart-list/liveart-list.component';
import { ExhibitShopComponent } from './exhibit-shop/exhibit-shop.component';
import { ExhibitAvComponent } from './exhibit-av/exhibit-av.component';
import { LiveartCameraComponent } from './liveart-camera/liveart-camera.component';
import { LiveartScanerComponent } from './liveart-scaner/liveart-scaner.component';
import { Page404Component } from './page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    PanoramaComponent,
    ExhibitDetailsComponent,
    TourDetailsComponent,
    LiveartListComponent,
    ExhibitShopComponent,
    ExhibitAvComponent,
    LiveartCameraComponent,
    LiveartScanerComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
