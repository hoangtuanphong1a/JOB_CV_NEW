import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';

export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  isRequired?: boolean;
}

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ label, placeholder, options, isRequired, ...rest }: SelectFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={rest.name}
      control={rest.control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
