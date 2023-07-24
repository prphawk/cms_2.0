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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Committee } from '@prisma/client';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CommitteeHeaders } from '~/constants/headers';
import { _addYears, _toLocaleString, _toString } from '~/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { api } from '~/utils/api';

export const CommitteeSchema = z
  .object({
    name: z
      .string({ required_error: `${CommitteeHeaders.NAME} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteeHeaders.NAME} é obrigatório` }),
    bond: z
      .string({ required_error: `${CommitteeHeaders.BOND} é obrigatório` })
      .trim()
      .min(1, { message: `${CommitteeHeaders.BOND} é obrigatório` }),
    begin_date: z.coerce.date({ required_error: `${CommitteeHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.coerce.date({ required_error: `${CommitteeHeaders.END_DATE} é obrigatória` }),
    ordinance: z.string().optional(),
    observations: z.string().optional(),
    committee_template_name: z.string().optional(),
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: `${CommitteeHeaders.END_DATE} não pode ocorrer antes de ${CommitteeHeaders.BEGIN_DATE}.`,
    path: ['end_date'],
  });

export default function CommitteeDialog(props: {
  open: boolean;
  handleOpenDialog: (dialogEnum: number) => void;
  committee?: Committee & { committee_template?: { name: string } | null };
  handleSave: (data: z.infer<typeof CommitteeSchema> & { id?: number }) => void;
}) {
  const myDefaultValues = () => {
    return {
      bond: props.committee?.bond || '',
      name: props.committee?.name || '',
      begin_date: _toString(props.committee?.begin_date || new Date()),
      end_date: _toString(props.committee?.end_date || _addYears(new Date(), 1)),
      ordinance: props.committee?.ordinance || '',
      observations: props.committee?.observations || '',
      committee_template_name: props.committee?.committee_template?.name || '',
    };
  };

  const form = useForm<z.infer<typeof CommitteeSchema>>({
    resolver: zodResolver(CommitteeSchema),
  });

  useEffect(() => {
    form.reset(myDefaultValues as any);
  }, [props.open]);

  function onSubmit(data: z.infer<typeof CommitteeSchema>) {
    props.handleSave({ id: props.committee?.id || undefined, ...data });
    onClose();
  }

  function onClose() {
    form.reset();
    props.handleOpenDialog(-1);
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
          onClick={onClose}
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
              label={CommitteeHeaders.NAME}
              placeholder="ex: Direção INF (2023)"
              required
            />
            <CommonFormItem
              form={form}
              fieldName="bond"
              label={CommitteeHeaders.BOND}
              placeholder="ex: Órgão"
              required
            />
            <div className="flex flex-row justify-between gap-x-4 pt-2">
              <DateFormItem
                form={form}
                fieldName="begin_date"
                label={CommitteeHeaders.BEGIN_DATE}
                required
              />
              <DateFormItem
                form={form}
                fieldName="end_date"
                label={CommitteeHeaders.END_DATE}
                //dontSelectBefore={form.getValues('begin_date')}
                required
              />
            </div>
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={CommitteeHeaders.ORDINANCE}
              placeholder="ex: Portaria"
            />
            <ObservationsFormItem form={form} label={CommitteeHeaders.OBSERVATIONS} />
            <TemplateSelectFormItem form={form} />
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

const TemplateSelectFormItem = (props: { form: any }) => {
  const [templates, setTemplates] = useState<string[]>([]);

  const { data, isLoading } = api.template.getAll.useQuery();

  useEffect(() => {
    if (data) setTemplates([...data.map((e) => e.name)]);
  }, [data]);

  const [createdIndex, setCreatedIndex] = useState<number>();

  const [commandSearch, setCommandSearch] = useState('');

  return (
    <FormField
      control={props.form.control}
      name="committee_template_name"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="pb-1">{CommitteeHeaders.TEMPLATE}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    !field.value && 'text-muted-foregroundPage hover:text-muted-foregroundPage',
                  )}
                >
                  {isLoading
                    ? 'Loading...'
                    : field.value
                    ? templates.find((template) => template === field.value)
                    : 'ex: Direção INF'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-96 p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite sua ${CommitteeHeaders.TEMPLATE}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                <CommandEmpty className="p-0">
                  {isLoading
                    ? 'Loading...'
                    : commandSearch && (
                        <Button
                          className="max-h-full w-full "
                          variant="ghost"
                          onClick={() => {
                            if (createdIndex) templates.pop();
                            setCreatedIndex(templates.length);
                            setTemplates([...templates, commandSearch]);
                            props.form.setValue('committee_template_name', commandSearch);
                          }}
                        >
                          <div className="truncate">
                            Criar {CommitteeHeaders.TEMPLATE} "{commandSearch}"?
                          </div>
                        </Button>
                      )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-y-auto">
                  {templates.map((template) => (
                    <CommandItem
                      value={template}
                      key={template}
                      onSelect={(value) => {
                        let found: string | undefined;
                        if (
                          value ===
                          props.form.getValues('committee_template_name')?.toLocaleLowerCase()
                        ) {
                          found = undefined;
                        } else found = templates.find((t) => t.toLocaleLowerCase() === value);
                        props.form.setValue('committee_template_name', found || '');
                      }}
                    >
                      {template}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          template === field.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription className="-mb-1.5">
            Instâncias de comissões <strong>permanentes</strong> devem pertencer a sua{' '}
            {CommitteeHeaders.TEMPLATE}.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const MyLabel = (props: { required?: boolean; className?: string } & PropsWithChildren) => {
  return (
    <FormLabel className={props.className}>
      {props.children}
      {props.required ? <span className="ml-1 text-red-700">*</span> : <></>}
    </FormLabel>
  );
};

export const CommonFormItem = (props: {
  form: any;
  fieldName: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className="mt-1">
          <MyLabel required={props.required}>{props.label}</MyLabel>
          <FormControl>
            <Input
              // required={props.required}
              className="placeholder:text-muted-foregroundPage"
              {...field}
              placeholder={props.placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const DateFormItem = (props: {
  form: any;
  fieldName: string;
  label: string;
  required?: boolean;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <MyLabel required={props.required}>{props.label}</MyLabel>
          <Input type="date" {...field} />
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

export const ObservationsFormItem = (props: { form: any; label: string }) => {
  return (
    <FormField
      control={props.form.control}
      name="observations"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Textarea
              rows={1}
              placeholder="Something something..."
              className="resize-y placeholder:text-muted-foregroundPage"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
