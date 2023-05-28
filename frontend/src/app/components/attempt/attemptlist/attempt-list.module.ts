import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {AttemptListRoutingModule} from "./attempt-list-routing.module";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {AttemptListComponent} from "./attempt-list.component";
import {ProgressBarModule} from "primeng/progressbar";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StyleClassModule,
        ButtonModule,
        AttemptListRoutingModule,
        RippleModule,
        InputTextModule,
        ToolbarModule,
        DataViewModule,
        DropdownModule,
        CheckboxModule,
        TooltipModule,
        ProgressBarModule
    ],
    declarations: [AttemptListComponent]
})
export class AttemptListModule {
}
