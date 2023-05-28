import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {StyleClassModule} from 'primeng/styleclass';
import {AdminNotificationRoutingModule} from "./admin-notification-routing.module";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {TooltipModule} from "primeng/tooltip";
import {AdminNotificationComponent} from "./admin-notification.component";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputTextareaModule} from "primeng/inputtextarea";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        AdminNotificationRoutingModule,
        RippleModule,
        InputTextModule,
        ToolbarModule,
        DataViewModule,
        DropdownModule,
        CheckboxModule,
        TooltipModule,
        AutoCompleteModule,
        InputTextareaModule
    ],
    declarations: [AdminNotificationComponent]
})
export class AdminNotificationModule {
}
