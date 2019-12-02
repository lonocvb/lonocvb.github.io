import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { ExhibitDetailsComponent } from './exhibit-details/exhibit-details.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { ExhibitShopComponent } from './exhibit-shop/exhibit-shop.component';
import { ExhibitAvComponent } from './exhibit-av/exhibit-av.component';
import { LiveartScanerComponent } from './liveart-scaner/liveart-scaner.component';
import { Page404Component } from './page404/page404.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { ExhibitsComponent } from './exhibits/exhibits.component';
import { PelementDirective } from './panorama/pelement.directive';
import { MainComponent } from './main/main.component';
import { FloatTopDirective } from './float-top.directive';
import { CameraComponent } from './camera/camera.component';
import { LiveartModelComponent } from './liveart-model/liveart-model.component';
import { GengarService } from './gengar.service';

@NgModule({
  declarations: [
    AppComponent,
    PanoramaComponent,
    ExhibitDetailsComponent,
    TourDetailsComponent,
    ExhibitShopComponent,
    ExhibitAvComponent,
    LiveartScanerComponent,
    Page404Component,
    TourListComponent,
    ExhibitsComponent,
    PelementDirective,
    MainComponent,
    FloatTopDirective,
    CameraComponent,
    LiveartModelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: () => () => {}, deps: [GengarService], multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule { }
