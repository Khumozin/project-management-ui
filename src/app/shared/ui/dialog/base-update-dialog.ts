import { Directive, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';

import { DialogData } from './dialog-data.model';

@Directive()
export abstract class BaseUpdateDialog<T extends { id: string }> {
  protected readonly _nnfb = inject(NonNullableFormBuilder);
  protected readonly _queryClient = inject(QueryClient);
  protected readonly _dialogRef = inject<BrnDialogRef<T>>(BrnDialogRef);
  protected readonly _dialogContext = injectBrnDialogContext<DialogData<T>>();

  form = this._nnfb.group<Record<string, FormGroup>>({});
  protected readonly data = this._dialogContext.data;

  protected abstract formKey: string;
  protected abstract entityName: string;
  protected abstract updateFn(item: T): Promise<T>;
  protected abstract invalidateKeys(): string[];

  readonly mutation = injectMutation(() => ({
    mutationFn: (item: T) => this.updateFn(item),
    onSuccess: (updated) => {
      this._queryClient.invalidateQueries({ queryKey: this.invalidateKeys() });
      toast.success(`${this.entityName} has been updated`);
      this._dialogRef.close(updated);
    },
    onError: () => {
      toast.error(`Failed to update ${this.entityName.toLowerCase()}`);
    },
  }));

  protected patchForm(): void {
    if (this.data) {
      this.form.controls[this.formKey].patchValue({ ...this.data });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }

    const raw = this.form.getRawValue();

    const entity = raw[this.formKey] as T;

    this.mutation.mutate(entity);
  }

  get isLoading() {
    return this.mutation.isPending;
  }
}