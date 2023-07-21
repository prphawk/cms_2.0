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
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { PropsWithChildren, useEffect, useState } from 'react';
import { CommitteeSchema, CommonFormItem } from '../committees/committee-dialog';
import { Committee } from '@prisma/client';
import { MembershipHeaders } from '~/constants/headers';

type MembersDataType = {
  employee: {
    id: number;
    name: string;
    is_active: boolean;
  };
} & {
  employee_id: number;
  committee_id: number;
  role: string | null;
  begin_date: Date;
  end_date: Date;
  is_temporary: boolean;
  is_active: boolean;
  observations: string | null;
};

export const MembershipSchema = z
  .object({
    name: z
      .string({ required_error: `${MembershipHeaders.NAME} é obrigatório` })
      .trim()
      .min(1, { message: `${MembershipHeaders.NAME} é obrigatório` }),
    role: z.string(),
    begin_date: z.coerce.date({ required_error: `${MembershipHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.coerce.date({ required_error: `${MembershipHeaders.END_DATE} é obrigatória` }),
    observations: z.string().optional(),
  })
  .array();

export default function MembershipDialog(props: {
  open: boolean;
  handleOpenDialog: (dialogEnum: number) => void;
  members?: MembersDataType[];
  // handleSave: () => void;
}) {
  const form = useForm<z.infer<typeof MembershipSchema>>({
    resolver: zodResolver(MembershipSchema),
  });

  useEffect(() => {
    //form.reset(myDefaultValues as any);
  }, [props.open]);

  function onSubmit() {
    // data: z.infer<typeof CommitteeSchema>
    //props.handleSave({ id: props.committee?.id || undefined, ...data });
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
          <DialogTitle>{props.members ? 'Editar' : 'Criar'} Membro(s)</DialogTitle>
          <DialogDescription>
            {props.members && (
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="formMembership">
            <div className="flex flex-row justify-between gap-x-4 pt-2">
              {props.members?.map((e, index) => (
                <CommonFormItem
                  key={index}
                  form={form}
                  fieldName="name"
                  label={MembershipHeaders.NAME}
                  defaultValue={e.employee.name || ''}
                  placeholder="ex: Direção INF (2023)"
                  required
                />
              ))}
            </div>
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
