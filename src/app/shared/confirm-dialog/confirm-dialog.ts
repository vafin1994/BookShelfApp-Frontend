import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButton],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  public dialogRef: MatDialogRef<ConfirmDialog, boolean> = inject(
    MatDialogRef<ConfirmDialog, boolean>,
  );
  data: string = inject<string>(MAT_DIALOG_DATA);

  onClose(result: boolean) {
    this.dialogRef.close(result);
  }
}
