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
import { useForm } from 'react-hook-form';
import { CommitteesHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
const CommitteeSchema = z
  .object({
    name: z.string({ required_error: `${CommitteesHeaders.NAME} é obrigatório` }),
    bond: z.string({ required_error: `${CommitteesHeaders.BOND} é obrigatório` }),
    begin_date: z.date({ required_error: `${CommitteesHeaders.BEGIN_DATE} é obrigatória` }),
    end_date: z.date({ required_error: `${CommitteesHeaders.END_DATE} é obrigatória` }),
    ordinance: z.string().optional(),
    observations: z.string().optional(),
  })
  .refine((data) => (data.begin_date || 0) < (data.end_date || new Date()), {
    message: 'Data de fim não pode ser antes da data de início.',
    path: ['end_date'],
  });

export default function CommitteeDialog(props: {
  open: boolean;
  handleOpenDialog: (open: boolean) => void;
  committee?: Committee;
  handleSave: (committee: z.infer<typeof CommitteeSchema>) => void;
}) {
  const form = useForm<z.infer<typeof CommitteeSchema>>({
    resolver: zodResolver(CommitteeSchema),
  });

  function onSubmit(data: z.infer<typeof CommitteeSchema>) {
    console.log(data);
  }

  return (
    <Dialog open={props.open} modal={false}>
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
            <CommonFormItem form={form} fieldName="name" label={CommitteesHeaders.NAME} />
            <CommonFormItem form={form} fieldName="bond" label={CommitteesHeaders.BOND} />
            <CommonFormItem form={form} fieldName="ordinance" label={CommitteesHeaders.ORDINANCE} />
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
              fieldName="observations"
              label={CommitteesHeaders.OBSERVATIONS}
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

const CommonFormItem = (props: { form: any; fieldName: string; label: string }) => {
  return (
    <FormField
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
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};
const ObservationsForm = (props: { form: any; fieldName: string; label: string }) => {
  return (
    <FormField
      control={props.form.control}
      name={props.fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <Textarea placeholder="Lorem ipsum" className="resize-y" {...field} />
          </FormControl>
          {/* <FormDescription>
            You can <span>@mention</span> other users and organizations.
          </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
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
