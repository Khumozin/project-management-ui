import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { AlertDialogData } from './alert-dialog-data.model';

@Component({
  selector: 'app-alert-dialog',
  imports: [BrnAlertDialogImports, HlmAlertDialogImports],
  template: `
    <hlm-alert-dialog-header>
      <h3 hlmAlertDialogTitle>
        {{ data.title }}
      </h3>
      <p hlmAlertDialogDescription>
        {{ data.description }}
      </p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer class="mt-4">
      @if (data.cancelButtonText) {
        <button hlmAlertDialogCancel (click)="close()">
          {{ data.cancelButtonText }}
        </button>
      }
      @if (data.proceedButtonText) {
        <button hlmAlertDialogAction (click)="proceed()">
          {{ data.proceedButtonText }}
        </button>
      }
    </hlm-alert-dialog-footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialog {
  private readonly _dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<AlertDialogData>();

  protected readonly data = this._dialogContext;

  close(): void {
    this._dialogRef.close();
  }

  proceed(): void {
    this._dialogRef.close(true);
  }
}
