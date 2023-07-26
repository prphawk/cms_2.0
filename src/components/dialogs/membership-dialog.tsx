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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { _addYears, _toLocaleString, _toString } from '~/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';
import { CommonFormItem, DateFormItem, MyLabel, ObservationsFormItem } from './committee-dialog';
import { MembershipHeaders } from '~/constants/headers';
import { api } from '~/utils/api';
import { Employee, Membership } from '@prisma/client';
import React from 'react';

export const MembershipSchema = z
  .object({
    employee: z.object({
      id: z.number().optional(),
      name: z
        .string({ required_error: `${MembershipHeaders.NAME} é obrigatório` })
        .trim()
        .min(1, { message: `${MembershipHeaders.NAME} é obrigatório` }),
    }),
    role: z
      .string({ required_error: `${MembershipHeaders.ROLE} é obrigatório` })
      .trim()
      .min(1, { message: `${MembershipHeaders.ROLE} é obrigatório` }),
    begin_date: z.coerce.date({ required_error: `${MembershipHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.coerce.date({ required_error: `${MembershipHeaders.END_DATE} é obrigatória` }),
    observations: z.string().optional(),
    ordinance: z.string().optional(),
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: `${MembershipHeaders.END_DATE} não pode ocorrer antes de ${MembershipHeaders.BEGIN_DATE}.`,
    path: ['end_date'],
  });
//.array();

export default function MembershipDialog(props: {
  open: boolean;
  handleOpenDialog: (dialogEnum: number) => void;
  member?: Membership & { employee: Employee };
  handleSave: (data: z.infer<typeof MembershipSchema>) => void;
  committee: { id: number; begin_date: Date | null; end_date: Date | null };
}) {
  const myDefaultValues = () => {
    return {
      employee: {
        id: props.member?.employee.id,
        name: props.member?.employee.name || '',
      },
      begin_date: _toString(props.member?.begin_date || props.committee.begin_date || new Date()),
      end_date: _toString(
        props.member?.end_date || props.committee.end_date || _addYears(new Date(), 1),
      ),
      ordinance: props.member?.ordinance || '',

      role: props.member?.role || '',
      observations: props.member?.observations || '',
    };
  };

  const form = useForm<z.infer<typeof MembershipSchema>>({
    resolver: zodResolver(MembershipSchema),
  });

  useEffect(() => {
    form.reset(myDefaultValues as any);
  }, [props.open, props.member]);

  function onSubmit(data: z.infer<typeof MembershipSchema>) {
    props.handleSave(data);
    onClose();
  }

  function onClose() {
    form.reset();
    props.handleOpenDialog(-1);
  }

  return (
    <Dialog open={props.open} modal={false}>
      {props.open && (
        <div className="fixed inset-0 z-50 bg-background/10 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.member ? 'Editar' : 'Criar'} Membro(s)</DialogTitle>
          <DialogDescription>
            {props.member && (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" id="formMembership">
            <div className="grid grid-cols-2 items-baseline justify-between gap-x-4">
              {/* {props.members?.map((e, index) => ( */}
              <EmployeeSelectFormItem
                form={form}
                disabled={props.member?.employee.id !== undefined}
              />
              <RoleSelectFormItem form={form} />
            </div>
            <CommonFormItem
              form={form}
              fieldName="ordinance"
              label={MembershipHeaders.ORDINANCE}
              placeholder="ex: Portaria"
            />
            <div className="grid grid-cols-2 items-baseline justify-between gap-x-4 pt-2">
              <DateFormItem
                form={form}
                fieldName="begin_date"
                label={MembershipHeaders.BEGIN_DATE}
                required
              />
              <DateFormItem
                form={form}
                fieldName="end_date"
                label={MembershipHeaders.END_DATE}
                required
              />
            </div>
            <ObservationsFormItem form={form} label={MembershipHeaders.OBSERVATIONS} />
            <DialogFooter>
              <Button type="submit" form="formMembership">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type EmployeeDataType = {
  id?: number;
  name: string;
};

const EmployeeSelectFormItem = (props: { form: any; disabled?: boolean }) => {
  const [employees, setEmployees] = useState<EmployeeDataType[]>([]);

  const { data, isLoading } = api.employee.getOptions.useQuery();

  useEffect(() => {
    if (data) setEmployees([...data]);
  }, [data]);

  const [createdIndex, setCreatedIndex] = useState<number>();

  const [commandSearch, setCommandSearch] = useState('');

  return (
    <FormField
      control={props.form.control}
      name="employee"
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <MyLabel required className="pb-1">
            {MembershipHeaders.NAME}
          </MyLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={props.disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'flex h-9 w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                    !field.value.name && 'text-muted-foregroundPage',
                  )}
                >
                  {isLoading
                    ? 'Loading...'
                    : field.value.name
                    ? employees?.find((e) => e.name === field.value.name)?.name
                    : 'ex: Fulano(a)'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-[249px] p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite seu/sua ${MembershipHeaders.NAME}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                {/* {isLoading && <CommandLoading>Loading...</CommandLoading>} */}
                <CommandEmpty className="p-0">
                  {commandSearch && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (createdIndex) employees.pop();
                        setCreatedIndex(employees.length);
                        const newItem = { name: commandSearch };
                        setEmployees([...employees, newItem]);
                        props.form.setValue('employee', newItem);
                      }}
                    >
                      <div className="truncate">
                        Criar {MembershipHeaders.NAME} "{commandSearch}"?
                      </div>
                    </Button>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-80 overflow-y-auto">
                  {employees.map((employee, index) => (
                    <CommandItem
                      value={employee.name}
                      key={index}
                      onSelect={(value) => {
                        let found: EmployeeDataType | undefined;
                        if (value === props.form.getValues('employee')?.name.toLocaleLowerCase()) {
                          found = undefined;
                        } else found = employees.find((e) => e.name.toLocaleLowerCase() === value);
                        props.form.setValue('employee', found || { name: '' });
                      }}
                    >
                      {employee.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          employee.name === field.value.name ? 'opacity-100' : 'opacity-0',
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
const RoleSelectFormItem = (props: { form: any }) => {
  const [roles, setRoles] = useState<string[]>([]);

  const { data, isLoading } = api.membership.getRoleOptions.useQuery();

  useEffect(() => {
    if (data) setRoles([...data]);
  }, [data]);

  const [createdIndex, setCreatedIndex] = useState<number>();

  const [commandSearch, setCommandSearch] = useState('');

  return (
    <FormField
      control={props.form.control}
      name="role"
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <MyLabel required className="pb-1">
            {MembershipHeaders.ROLE}
          </MyLabel>
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
                    ? roles.find((r) => r === field.value)
                    : 'ex: Membro(a)'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="offset w-[249px] p-0">
              <Command isLoading={isLoading}>
                <CommandInput
                  placeholder={`Digite seu ${MembershipHeaders.ROLE}...`}
                  className="h-9"
                  onValueChange={(search) => setCommandSearch(search)}
                />
                <CommandEmpty className="p-0">
                  {commandSearch && (
                    <Button
                      className="max-h-full w-full "
                      variant="ghost"
                      onClick={() => {
                        if (createdIndex) roles.pop();
                        setCreatedIndex(roles.length);
                        setRoles([...roles, commandSearch]);
                        props.form.setValue('role', commandSearch);
                      }}
                    >
                      <div className="truncate">
                        Criar {MembershipHeaders.ROLE} "{commandSearch}"?
                      </div>
                    </Button>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-80 overflow-y-auto">
                  {roles.map((role, index) => (
                    <CommandItem
                      value={role}
                      key={index}
                      onSelect={(value) => {
                        let found: string | undefined;
                        if (value === props.form.getValues('role')?.toLocaleLowerCase()) {
                          found = undefined;
                        } else found = roles.find((r) => r.toLocaleLowerCase() === value);
                        props.form.setValue('role', found || '');
                      }}
                    >
                      {role}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          role === field.value ? 'opacity-100' : 'opacity-0',
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
