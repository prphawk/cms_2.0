import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { PropsWithChildren } from 'react'
import { _toLocaleString } from '~/utils/string'
import { MyDialog, MyDialogClose } from './my-dialog'

export const AlertDialog = (
  props: PropsWithChildren & {
    open: boolean
    handleOpenDialog(dialogEnum: number): void
    handleContinue(): void
    description?: JSX.Element | string
  }
) => {
  function onClose() {
    props.handleOpenDialog(-1)
  }

  function onContinue() {
    onClose()
    props.handleContinue()
  }

  return (
    <MyDialog open={props.open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza?</DialogTitle>
          <DialogDescription>{props.description || 'Esta ação é permanente.'}</DialogDescription>
        </DialogHeader>
        <MyDialogClose onClose={onClose} />
        <DialogFooter>
          <Button size="sm" variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" type="button" onClick={onContinue}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </MyDialog>
  )
}
