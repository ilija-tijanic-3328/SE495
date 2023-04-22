import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NewAttemptComponent} from "./new-attempt.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: NewAttemptComponent},
        {path: ':code', component: NewAttemptComponent},
    ])],
    exports: [RouterModule]
})
export class NewAttemptRoutingModule {
}
