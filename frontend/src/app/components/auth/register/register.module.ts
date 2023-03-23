import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterRoutingModule} from './register-routing.module';
import {RegisterComponent} from './register.component';
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
        RegisterRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        DialogModule,
        RippleModule,
        InputMaskModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule {
}
