import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {LogoutComponent} from "./logout.component";
import {ConfirmComponent} from "./confirm.component";

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule
    ],
    declarations: [LogoutComponent, ConfirmComponent]
})
export class AuthModule {
}
