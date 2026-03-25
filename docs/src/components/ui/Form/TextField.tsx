import { Eye, EyeOff } from 'lucide-react';
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { useToggle } from 'react-use';

import { Input } from '@/components/ui/input';

import { FormField, FormItem, FormLabel, FormMessage } from '../form';

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  label?: string;
  isPassword?: boolean;
  isRequired?: boolean;
}

export function TextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ label, type = 'text', isPassword, isRequired, ...inputProps }: TextFieldProps<TFieldValues, TName>) {
  const [show, toggle] = useToggle(false);
  const isNum = type === 'number';
  const renderedType = isPassword ? (show ? 'text' : 'password') : 'text';

  return (
    <FormField
      name={inputProps.name}
      control={inputProps.control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}
          <div className="relative">
            <FormItem>
              <Input
                {...field}
                {...inputProps}
                type={renderedType}
                inputMode={isNum ? 'decimal' : undefined}
                onChange={(e) => {
                  let val = e.target.value;
                  if (isNum) val = val.replace(/[^0-9]/g, '');
                  field.onChange(val);
                }}
              />
            </FormItem>
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                onClick={toggle}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
