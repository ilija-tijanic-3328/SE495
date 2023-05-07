import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {InvitationListComponent} from "./invitation-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: InvitationListComponent},
    ])],
    exports: [RouterModule]
})
export class InvitationListRoutingModule {
}
