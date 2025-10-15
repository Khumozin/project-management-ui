import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectForm } from '../ui/project-form';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { BaseAddDialog } from '../../../shared/ui/dialog/base-add-dialog';
import { Project } from '../data/project.model';
import { ProjectsService } from '../data/internal/projects-service';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { Dialog } from '../../../shared/ui/dialog/dialog';

const FORM_KEY = 'Project';

@Component({
  selector: 'app-project-add',
  imports: [ProjectForm, ReactiveFormsModule, HlmButtonImports, HlmIcon, Dialog, NgIcon],
  providers: [provideIcons({ lucideLoaderCircle })],
  template: `
    <app-dialog
      [title]="_dialogContext.title"
      [description]="_dialogContext.description"
      [icon]="_dialogContext.icon"
    >
      <form content [formGroup]="form" class="w-full py-4 flex flex-col">
        <app-project-form [controlKey]="formKey" />
      </form>

      <ng-container actions>
        <button #action hlmBtn type="submit" [disabled]="isLoading()" (click)="save()">
          @if (isLoading()) {
            <ng-icon hlm name="lucideLoaderCircle" size="sm" class="mr-2 animate-spin" />

            Saving
          } @else {
            Save changes
          }
        </button>
      </ng-container>
    </app-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAdd extends BaseAddDialog<Project> {
  private readonly _projectsService = inject(ProjectsService);

  protected readonly formKey = FORM_KEY;
  protected readonly entityName = FORM_KEY;

  protected override addFn(item: Project): Promise<Project> {
    return this._projectsService.addProject(item);
  }

  protected override invalidateKeys(): string[] {
    return ['projects'];
  }
}
