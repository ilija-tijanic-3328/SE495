import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {LogoutComponent} from "./logout.component";

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule
    ],
    declarations: [LogoutComponent]
})
export class AuthModule {
}
