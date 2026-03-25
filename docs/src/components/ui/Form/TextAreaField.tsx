import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { Textarea } from '@/components/ui/textarea';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';

export interface TextAreaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  label?: string;
  isRequired?: boolean;
}

export function TextAreaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ label, isRequired, ...textareaProps }: TextAreaFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={textareaProps.name}
      control={textareaProps.control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} {...textareaProps} className="min-h-[150px]" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
