'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Committee } from '@prisma/client';
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CommitteesHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { useState } from 'react';

export const CommitteeSchema = z
  .object({
    name: z
      .string({ required_error: `${CommitteesHeaders.NAME} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteesHeaders.NAME} é obrigatório` }),
    bond: z
      .string({ required_error: `${CommitteesHeaders.BOND} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteesHeaders.BOND} é obrigatório` }),
    begin_date: z.date({ required_error: `${CommitteesHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.date({ required_error: `${CommitteesHeaders.END_DATE} é obrigatória` }),
    ordinance: z.string().optional(),
    observations: z.string().optional(),
    template_committee: z.string().optional(),
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: `${CommitteesHeaders.END_DATE} não pode ocorrer antes de ${CommitteesHeaders.BEGIN_DATE}.`,
    path: ['end_date'],
  });

export default function CommitteeDialog(props: {
  open: boolean;
  handleOpenDialog: (open: boolean) => void;
  committee?: Committee;
  handleSave: (data: z.infer<typeof CommitteeSchema>) => void;
}) {
  const form = useForm<z.infer<typeof CommitteeSchema>>({
    resolver: zodResolver(CommitteeSchema),
  });

  function onSubmit(data: z.infer<typeof CommitteeSchema>) {
    console.log('onSubmit');
    props.handleSave(data);
    form.reset();
  }

  return (
    <Dialog open={props.open} modal={false}>
      {props.open && (
        <div className="fixed inset-0 z-50 bg-background/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.committee ? 'Editar' : 'Criar'} Órgão Colegiado</DialogTitle>
          <DialogDescription>
            {props.committee && (
              <>
                Ao editar, os dados anteriores do órgão serão <strong>descartados</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div
          onClick={() => props.handleOpenDialog(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:outline-2 hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="formCommittee">
            <CommonFormItem
              form={form}
              fieldName="name"
              label={CommitteesHeaders.NAME}
              defaultValue={props.committee?.name || ''}
            />
            <TemplateSelectFormItem form={form} defaultValue={''} />

            <CommonFormItem
              form={form}
              fieldName="bond"
              label={CommitteesHeaders.BOND}
              defaultValue={props.committee?.bond || ''}
            />
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={CommitteesHeaders.ORDINANCE}
              defaultValue={props.committee?.ordinance || ''}
            />
            <div className="flex flex-row justify-between gap-4">
              <DateForm form={form} fieldName="begin_date" label={CommitteesHeaders.BEGIN_DATE} />
              <DateForm
                form={form}
                fieldName="end_date"
                label={CommitteesHeaders.END_DATE}
                dontSelectBefore={form.getValues('begin_date')}
              />
            </div>
            <ObservationsForm
              form={form}
              label={CommitteesHeaders.OBSERVATIONS}
              defaultValue={props.committee?.observations || ''}
            />
            <DialogFooter>
              <Button type="submit" form="formCommittee">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const TemplateSelectFormItem = (props: { form: any; defaultValue?: string }) => {
  const [languages, setLanguages] = useState([
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Spanish', value: 'es' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Chinese', value: 'zh' },
  ]);

  const [commandSearch, setCommandSearch] = useState('');

  return (
    <FormField
      //defaultValue={props.defaultValue || ''}
      control={props.form.control}
      name="template_committee"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Language</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-[200px] justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value
                    ? languages.find((language) => language.value === field.value)?.label
                    : field.value || 'Select language'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder={`Procurar ${CommitteesHeaders.TEMPLATE}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                <CommandEmpty>
                  No framework found.
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn('w-[200px] justify-between')}
                    onClick={() =>
                      setLanguages([...languages, { label: commandSearch, value: commandSearch }])
                    }
                  >
                    Criar classe {commandSearch}?
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {languages.map((language) => (
                    <CommandItem
                      value={language.value}
                      key={language.value}
                      onSelect={(value) => {
                        props.form.setValue('template_committee', value);
                      }}
                    >
                      {language.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          language.value === field.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const CommonFormItem = (props: {
  form: any;
  fieldName: 'name' | 'bond' | 'ordinance';
  label: string;
  defaultValue?: string;
}) => {
  return (
    <FormField
      defaultValue={props.defaultValue || ''}
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className="mt-1">
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DateForm = (props: {
  form: any;
  fieldName: 'begin_date' | 'end_date';
  label: string;
  dontSelectBefore?: Date;
  defaultValue?: string;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col" defaultValue={props.defaultValue || ''}>
          <FormLabel>{props.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? _toLocaleString(field.value) : <span>Escolha uma data</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date: Date) =>
                  date < (props.dontSelectBefore || 0) || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

const ObservationsForm = (props: { form: any; label: string; defaultValue?: string }) => {
  return (
    <FormField
      control={props.form.control}
      name="observations"
      render={({ field }) => (
        <FormItem defaultValue={props.defaultValue || ''}>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Textarea placeholder="Lorem ipsum" className="resize-y" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
