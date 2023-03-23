import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetPasswordRoutingModule} from './reset-password-routing.module';
import {ResetPasswordComponent} from './reset-password.component';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from "primeng/dialog";
import {RippleModule} from "primeng/ripple";
import {InputMaskModule} from "primeng/inputmask";

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DialogModule,
        RippleModule,
        InputMaskModule
    ],
    declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule {
}
