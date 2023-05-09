import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingRoutingModule} from './landing-routing.module';
import {LandingComponent} from './landing.component';
import {StyleClassModule} from 'primeng/styleclass';
import {DividerModule} from 'primeng/divider';
import {ChartModule} from 'primeng/chart';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {PasswordModule} from "primeng/password";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {KeyFilterModule} from "primeng/keyfilter";
import {ScrollTopModule} from "primeng/scrolltop";

@NgModule({
    imports: [
        CommonModule,
        LandingRoutingModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        PasswordModule,
        InputTextModule,
        FormsModule,
        KeyFilterModule,
        ScrollTopModule
    ],
    declarations: [LandingComponent]
})
export class LandingModule {
}
