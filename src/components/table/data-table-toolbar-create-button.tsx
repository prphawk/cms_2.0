import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

export default function TableToolbarCreateButton(props: { onCreate: () => void; label: string }) {
  return (
    <>
      <Button
        onClick={props.onCreate}
        variant="outline"
        size="sm"
        className="ml-auto mr-2 hidden h-8 bg-transparent lg:flex"
      >
        <PlusIcon className="mr-2 h-5 w-5" />
        Criar {props.label.toLowerCase()}
      </Button>
    </>
  )
}
