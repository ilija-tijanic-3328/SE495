import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {QuizListComponent} from "./quiz-list.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: QuizListComponent},
    ])],
    exports: [RouterModule]
})
export class QuizListRoutingModule {
}
