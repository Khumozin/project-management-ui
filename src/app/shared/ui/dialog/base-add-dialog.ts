import { Directive, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';

import { DialogData } from './dialog-data.model';

@Directive()
export abstract class BaseAddDialog<T extends { id: string }> {
  protected readonly _nnfb = inject(NonNullableFormBuilder);
  protected readonly _dialogRef = inject<BrnDialogRef<T>>(BrnDialogRef);
  protected readonly _queryClient = inject(QueryClient);
  protected readonly _dialogContext = injectBrnDialogContext<DialogData<T>>();

  form = this._nnfb.group<Record<string, FormGroup>>({});

  protected abstract formKey: string;
  protected abstract entityName: string;
  protected abstract addFn(item: T): Promise<T>;
  protected abstract invalidateKeys(): string[];

  readonly mutation = injectMutation(() => ({
    mutationFn: (item: T) => this.addFn(item),
    onSuccess: (created) => {
      this._queryClient.invalidateQueries({ queryKey: this.invalidateKeys() });
      toast.success(`${this.entityName} has been created`);
      this._dialogRef.close(created);
    },
    onError: () => {
      toast.error(`Failed to create ${this.entityName.toLowerCase()}`);
    },
  }));

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