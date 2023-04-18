import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AccountComponent} from './account.component';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {PanelMenuModule} from 'primeng/panelmenu';
import {AccountRoutingModule} from "./account-routing.module";
import {ChangePasswordComponent} from "./change-password.component";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {InputMaskModule} from "primeng/inputmask";
import {InputTextModule} from "primeng/inputtext";
import {AccordionModule} from "primeng/accordion";
import {DeleteAccountComponent} from "./delete-account.component";
import {MessagesModule} from "primeng/messages";
import {DialogModule} from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        AccountRoutingModule,
        PasswordModule,
        RippleModule,
        InputMaskModule,
        InputTextModule,
        AccordionModule,
        MessagesModule,
        DialogModule
    ],
    declarations: [ChangePasswordComponent, DeleteAccountComponent, AccountComponent]
})
export class AccountModule {
}
