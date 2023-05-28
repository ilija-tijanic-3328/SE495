import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {AdminQuizListRoutingModule} from "./admin-quiz-list-routing.module";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {DialogModule} from "primeng/dialog";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {AdminQuizListComponent} from "./admin-quiz-list.component";
import {RatingModule} from "primeng/rating";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        AdminQuizListRoutingModule,
        RippleModule,
        InputTextModule,
        ToolbarModule,
        DialogModule,
        DataViewModule,
        DropdownModule,
        TagModule,
        CheckboxModule,
        TooltipModule,
        RatingModule
    ],
    declarations: [AdminQuizListComponent]
})
export class AdminQuizListModule {
}
