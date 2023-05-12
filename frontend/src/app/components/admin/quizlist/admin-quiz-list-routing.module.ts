import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AdminQuizListComponent} from "./admin-quiz-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: AdminQuizListComponent},
    ])],
    exports: [RouterModule]
})
export class AdminQuizListRoutingModule {
}
