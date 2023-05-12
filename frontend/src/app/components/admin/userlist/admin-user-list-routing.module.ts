import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AdminUserListComponent} from "./admin-user-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AdminUserListComponent},
    ])],
    exports: [RouterModule]
})
export class AdminUserListRoutingModule {
}
