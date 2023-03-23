import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutModule} from './layout/app.layout.module';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {ProductService} from './services/product.service';
import {CountryService} from './services/country.service';
import {CustomerService} from './services/customer.service';
import {EventService} from './services/event.service';
import {IconService} from './services/icon.service';
import {NodeService} from './services/node.service';
import {PhotoService} from './services/photo.service';
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ToastModule
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
