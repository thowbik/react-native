import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { File } from '@ionic-native/file/ngx';
import { InterceptorsService } from './services/interceptors/interceptors.service';
import { AppVersion } from '@ionic-native/app-version/ngx'
import { Market } from '@ionic-native/market/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { Globalization } from '@ionic-native/globalization/ngx';

// import {UiComponentsComponent} from './ui-components/ui-components.component'
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent,

  ],
  entryComponents: [],
  imports: [BrowserModule,
    FormsModule,
     IonicModule.forRoot(), 
     AppRoutingModule,
      IonicStorageModule.forRoot(),
    HttpClientModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicSelectableModule,

  
 ],
providers: [
  StatusBar,
  SplashScreen,
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorsService,
    multi: true
  },
  Network,
  Camera,
  File,
  AppVersion,
  Market,
  Globalization
],
  exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
