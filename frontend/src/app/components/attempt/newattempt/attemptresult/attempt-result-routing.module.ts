import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AttemptResultComponent} from "./attempt-result.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AttemptResultComponent},
        {path: ':code', component: AttemptResultComponent},
    ])],
    exports: [RouterModule]
})
export class AttemptResultRoutingModule {
}
