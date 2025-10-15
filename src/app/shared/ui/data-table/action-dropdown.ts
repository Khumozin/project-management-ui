import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-action-dropdown',
  imports: [HlmIcon, NgIcon, HlmButtonImports, HlmMenuImports, BrnMenuImports],
  providers: [provideIcons({ lucideEllipsis })],
  template: `
    <button hlmBtn variant="ghost" class="h-8 w-8 p-0" [brnMenuTriggerFor]="ActionDropDownMenu">
      <span class="sr-only">Open menu</span>
      <ng-icon hlm size="sm" name="lucideEllipsis" />
    </button>

    <ng-template #ActionDropDownMenu>
      <hlm-menu>
        <hlm-menu-label>Actions</hlm-menu-label>
        <button hlmMenuItem (click)="updateHandler()">Update</button>
        <button hlmMenuItem (click)="deleteHandler()">Delete</button>
      </hlm-menu>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionDropdown<T> {
  private readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();

  readonly update = output<T>();

  readonly delete = output<T>();

  updateHandler(): void {
    this.update.emit(this._context.row.original);
  }

  deleteHandler(): void {
    this.delete.emit(this._context.row.original);
  }
}
