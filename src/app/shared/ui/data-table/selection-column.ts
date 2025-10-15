import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnCheckboxImports } from '@spartan-ng/brain/checkbox';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { CellContext, HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-selection-column',
  imports: [BrnCheckboxImports, HlmCheckboxImports],
  template: `
    <hlm-checkbox [checked]="_checkedState()" (checkedChange)="_context.table.toggleAllRowsSelected()" />
  `,
  styles: ``,
  host: {
    class: 'px-1 block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSelection<T> {
  protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
  protected _checkedState(): boolean | 'indeterminate' {
    if (this._context.table.getIsAllRowsSelected()) {
      return true;
    }
    if (this._context.table.getIsSomeRowsSelected()) {
      return 'indeterminate';
    }
    return false;
  }
}

@Component({
  imports: [BrnCheckboxImports, HlmCheckboxImports],
  template: `
    <hlm-checkbox
      type="checkbox"
      [checked]="_context.row.getIsSelected()"
      (checkedChange)="_context.row.getToggleSelectedHandler()($event)"
    />
  `,
  host: {
    class: 'px-1 block',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowSelection<T> {
  protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
}
