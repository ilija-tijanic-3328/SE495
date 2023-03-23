import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ForgotPasswordRoutingModule} from './forgot-password-routing.module';
import {ForgotPasswordComponent} from './forgot-password.component';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from "primeng/ripple";

@NgModule({
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        RippleModule
    ],
    declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
