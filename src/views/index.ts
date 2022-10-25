export interface content {
  label: string;
  field: string;
  onFocus?: boolean;
  itemSpan?: any;

  type?: string;
  visable?: boolean;
  children?: content[];
}
