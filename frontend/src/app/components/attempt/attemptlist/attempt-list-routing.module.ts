import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AttemptListComponent} from "./attempt-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AttemptListComponent},
    ])],
    exports: [RouterModule]
})
export class AttemptListRoutingModule {
}
