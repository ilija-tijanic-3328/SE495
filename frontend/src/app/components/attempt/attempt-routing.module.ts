import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// @ts-ignore
@NgModule({
    imports: [RouterModule.forChild([
        {path: '', loadChildren: () => import('./attemptlist/attempt-list.module').then(m => m.AttemptListModule)}
    ])],
    exports: [RouterModule]
})
export class AttemptRoutingModule {
}
