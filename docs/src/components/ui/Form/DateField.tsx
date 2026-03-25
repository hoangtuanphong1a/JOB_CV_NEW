'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { FormControl, FormField, FormItem, FormMessage } from '../form';

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: TName;
  control: ControllerProps<TFieldValues, TName>['control'];
  label?: string;
  isRequired?: boolean;
}

export function DateField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  label,
  isRequired,
  ...props
}: Props<TFieldValues, TName>) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={cn('text-sm font-medium', isRequired && "after:text-red-600 after:content-['*']")}>
          {label}
        </label>
      )}
      <FormField
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'border-primary-100 h-11 w-full justify-start text-left font-normal text-black shadow-xs transition-[color,box-shadow]',
                      !field.value && 'text-muted-foreground',
                      props.className
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" captionLayout="dropdown" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
