import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { CommitteeDataType } from '~/pages/dashboard/committees/[id]';

export default function CommitteesTableToolbarActions(props: {
  handleCreateCommittee: () => void;
}) {
  return (
    <>
      <Button
        onClick={props.handleCreateCommittee}
        variant="outline"
        size="sm"
        className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Criar órgão colegiado
      </Button>
    </>
  );
}
