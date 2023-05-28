import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TwoFactorRoutingModule} from './two-factor-routing.module';
import {TwoFactorComponent} from './two-factor.component';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from "primeng/ripple";

@NgModule({
    imports: [
        CommonModule,
        TwoFactorRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        RippleModule
    ],
    declarations: [TwoFactorComponent]
})
export class TwoFactorModule {
}
