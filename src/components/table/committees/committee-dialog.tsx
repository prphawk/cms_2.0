import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Committee } from '@prisma/client';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { CommitteesHeaders } from '~/constants/headers';
import { _toLocaleString } from '~/utils/string';

export default function CommitteeDialog(props: {
  open: boolean;
  handleOpenDialog: (open: boolean) => void;
  committee: Committee;
  handleSave: (committee: Committee) => void;
}) {
  const [committee, setcommittee] = useState(props.committee);

  return (
    <Dialog open={props.open} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar</DialogTitle>
          <DialogDescription>
            Ao editar, os dados anteriores do órgão serão <strong>descartados</strong>.
          </DialogDescription>
        </DialogHeader>
        <div
          onClick={() => props.handleOpenDialog(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
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
              id="name"
              value={committee.name}
              onChange={(e) => setcommittee({ ...committee, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {CommitteesHeaders.BOND}
            </Label>
            <Input
              value={committee.bond}
              onChange={(e) => setcommittee({ ...committee, bond: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {CommitteesHeaders.ORDINANCE}
            </Label>
            <Input
              value={committee.ordinance || undefined}
              onChange={(e) => setcommittee({ ...committee, ordinance: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {CommitteesHeaders.BEGIN_DATE}
            </Label>
            <Input
              value={_toLocaleString(committee.begin_date)}
              onChange={(e) => setcommittee({ ...committee, begin_date: new Date(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {CommitteesHeaders.END_DATE}
            </Label>
            <Input
              value={_toLocaleString(committee.end_date)}
              onChange={(e) => setcommittee({ ...committee, end_date: new Date(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {CommitteesHeaders.OBSERVATIONS}
            </Label>
            <Input
              value={committee.observations || undefined}
              onChange={(e) => setcommittee({ ...committee, observations: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => props.handleSave(committee)}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
