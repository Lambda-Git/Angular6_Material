import { NgModule } from "@angular/core";
import { McConfirmService } from "./mc-confirm.service";
import { McConfirmComponent } from "./mc-confirm.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { MatButtonModule, MatSnackBarModule } from "@angular/material";
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    FlexLayoutModule
  ],
  declarations: [McConfirmComponent],
  providers: [
    McConfirmService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  exports: [McConfirmComponent],
  entryComponents: [McConfirmComponent]
})
export class McConfirmModule {}

export { McConfirmService } from "./mc-confirm.service";
