import { Dialog } from '@/components/ui/dialog'
import { XIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

export const MyDialog = (props: PropsWithChildren & { open: boolean }) => {
  return (
    <Dialog open={props.open} modal={false}>
      {props.open && (
        <div className="fixed inset-0 z-50 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      )}
      {props.children}
    </Dialog>
  )
}

export const MyDialogClose = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      onClick={onClose}
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:outline-2 hover:ring-2 hover:ring-ring hover:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
    >
      <XIcon className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </div>
  )
}
