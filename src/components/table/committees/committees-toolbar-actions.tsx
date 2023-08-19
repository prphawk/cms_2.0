import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { MyHeaders } from '~/constants/headers'

export default function CommitteesTableToolbarActions(props: {
  handleCreateCommittee: () => void
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
        Criar {MyHeaders.INSTANCE.toLowerCase()}
      </Button>
    </>
  )
}
