import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AttemptResultComponent} from "./attempt-result.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AttemptResultComponent, title: 'Quiz Results'},
        {path: ':code', component: AttemptResultComponent, title: 'Quiz Results'},
    ])],
    exports: [RouterModule]
})
export class AttemptResultRoutingModule {
}
