import { ChangeDetectionStrategy, Component, contentChildren, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFolder, lucideShoppingBag } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

@Component({
  selector: 'app-dialog',
  imports: [HlmIcon, NgIcon, HlmDialogImports],
  template: `
    <hlm-dialog-header>
      <span class="w-full flex gap-2">
        <span
          class="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800"
        >
          <ng-icon hlm size="sm" [name]="icon()" />
        </span>

        <span class="w-full flex flex-col gap-1">
          @if (title()) {
            <h3 hlmDialogTitle class="text-foreground">{{ title() }}</h3>
          }
          @if (description()) {
            <p hlmDialogDescription>{{ description() }}</p>
          }
        </span>
      </span>
    </hlm-dialog-header>

    <!-- body -->
    <ng-content select="[content]" />

    <!-- actions -->
    @if (actions().length > 0) {
      <hlm-dialog-footer class="py-2 gap-4">
        <ng-content select="[actions]" />
      </hlm-dialog-footer>
    }
  `,
  host: {
    class: 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100',
  },
  providers: [provideIcons({ lucideFolder, lucideShoppingBag })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  title = input<string>();
  description = input<string>();
  icon = input<string>();

  actions = contentChildren('action');
}
