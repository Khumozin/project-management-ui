import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseUpdateDialog } from '../../../shared/ui/dialog/base-update-dialog';
import { Project } from '../data/project.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { ProjectForm } from '../ui/project-form';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { Dialog } from '../../../shared/ui/dialog/dialog';
import { ProjectsService } from '../data/internal/projects-service';

const FORM_KEY = 'Project';

@Component({
  selector: 'app-project-update',
  imports: [ProjectForm, ReactiveFormsModule, HlmButton, HlmIcon, Dialog, NgIcon],
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectUpdate extends BaseUpdateDialog<Project> {
  private readonly _projectService = inject(ProjectsService);

  protected override formKey = FORM_KEY;
  protected override entityName = FORM_KEY;

  ngAfterViewInit(): void {
    this.patchForm();
  }

  protected override updateFn(item: Project): Promise<Project> {
    return this._projectService.updateProject(item.id, item);
  }

  protected override invalidateKeys(): string[] {
    return ['projects'];
  }
}
