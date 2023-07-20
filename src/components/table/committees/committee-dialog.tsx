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
import { Label } from '@/components/ui/label';
import { Committee } from '@prisma/client';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { CommitteesHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CommitteeSchema } from '~/pages/dashboard/committees/[id]';
const FormSchema = z
  .object({
    begin_date: z.date(),
    end_date: z.date(),
  })
  .partial()
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: 'Data de fim deve vir depois da data de início.',
    path: ['end_date'],
  });

export default function CommitteeDialog(props: {
  open: boolean;
  handleOpenDialog: (open: boolean) => void;
  committee?: Committee;
  handleSave: (committee: z.infer<typeof CommitteeSchema>) => void;
}) {
  // const [committee, setCommittee] = useState(
  //   props.committee || {
  //     name: '',
  //     bond: '',
  //     begin_date: new Date(),
  //     end_date: new Date(),
  //     ordinance: '',
  //     observations: '',
  //   },
  // );

  // const form = useForm<z.infer<typeof CommitteeSchema>>({
  //   resolver: zodResolver(CommitteeSchema),
  // });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Dialog open={props.open} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.committee ? 'Editar' : 'Criar'}</DialogTitle>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="formCommittee">
            <div className="flex flex-row justify-between gap-4">
              <DateForm form={form} fieldName="begin_date" label={CommitteesHeaders.BEGIN_DATE} />
              <DateForm
                form={form}
                fieldName="end_date"
                label={CommitteesHeaders.END_DATE}
                dontSelectBefore={form.getValues('begin_date')}
              />
            </div>
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

const DateForm = (props: {
  form: any;
  fieldName: 'begin_date' | 'end_date' | 'dob';
  label: string;
  dontSelectBefore?: Date;
}) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
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
          {/* <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription> */}
          <FormMessage />
          {/* //TODO botar mensagem de erro no zod */}
        </FormItem>
      )}
    ></FormField>
  );
};
/*
const DialogBody = () => {
  return (
    <>
      <div
        onClick={() => props.handleOpenDialog(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:outline-2 hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {CommitteesHeaders.NAME}
          </Label>
          <Input
            required={true}
            id="name"
            value={committee.name || undefined}
            onChange={(e) => setCommittee({ ...committee, name: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {CommitteesHeaders.BOND}
          </Label>
          <Input
            required={true}
            value={committee.bond}
            onChange={(e) => setCommittee({ ...committee, bond: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {CommitteesHeaders.ORDINANCE}
          </Label>
          <Input
            value={committee.ordinance || undefined}
            onChange={(e) => setCommittee({ ...committee, ordinance: e.target.value })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            {CommitteesHeaders.BEGIN_DATE}
          </Label>
          <Input
            value={_toLocaleString(committee.begin_date)}
            onChange={(e) => setCommittee({ ...committee, begin_date: new Date(e.target.value) })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            {CommitteesHeaders.END_DATE}
          </Label>
          <Input
            value={_toLocaleString(committee.end_date)}
            onChange={(e) => setCommittee({ ...committee, end_date: new Date(e.target.value) })}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            {CommitteesHeaders.OBSERVATIONS}
          </Label>
          <Input
            value={committee.observations || undefined}
            onChange={(e) => setCommittee({ ...committee, observations: e.target.value })}
            className="col-span-3"
          />
        </div>
      </div>
    </>
  );
};
*/
