export interface DialogData<T = null> {
  title: string;
  description?: string;
  icon: string;
  data: T;
}
