import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AdminNotificationComponent} from "./admin-notification.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AdminNotificationComponent},
    ])],
    exports: [RouterModule]
})
export class AdminNotificationRoutingModule {
}
