import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-project-form',
  imports: [HlmInputImports, HlmFormFieldImports, HlmLabelImports, ReactiveFormsModule],
  template: `
    <ng-container [formGroupName]="controlKey()">
      <div class="w-full flex flex-col gap-y-2">
        <hlm-form-field>
          <label hlmLabel class="text-foreground"> Name </label>
          <input hlmInput type="text" formControlName="name" class="text-foreground" />
          <hlm-error>Name is required.</hlm-error>
        </hlm-form-field>

        <hlm-form-field>
          <label hlmLabel class="text-foreground"> Description </label>
          <textarea
            class="min-h-[80px] text-foreground"
            hlmInput
            type="text"
            formControlName="description"
          ></textarea>
          <hlm-error>Description is required.</hlm-error>
        </hlm-form-field>
      </div>
    </ng-container>
  `,
  styles: `
    input {
      @apply w-full focus-visible:ring-1 focus-visible:ring-offset-0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ProjectForm {
  private readonly _parentContainer = inject(ControlContainer);
  private readonly _nnfb = inject(NonNullableFormBuilder);

  readonly controlKey = input.required<string>();

  get parentFormGroup(): FormGroup {
    return this._parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }

  private buildForm(): void {
    const group = this._nnfb.group({
      id: '',
      name: ['', Validators.required],
      description: ['', Validators.required],
      createdAt: '',
      updatedAt: '',
    });

    this.parentFormGroup.addControl(this.controlKey(), group);
  }
}
