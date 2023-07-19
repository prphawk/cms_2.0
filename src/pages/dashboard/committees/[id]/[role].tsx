import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { Label } from '@/components/ui/label';
import AuthenticatedPage from '~/components/authenticated-page';
import PageLayout, { TextLayout } from '~/layout';
import { useState } from 'react';

export default function CommitteeRoleHistory() {
  const router = useRouter();

  const param_id = router.query.id;

  const [open, setOpen] = useState(false);

  return (
    <AuthenticatedPage>
      <PageLayout>
        <Button onClick={() => setOpen(true)}>open</Button>
        <Dialog open={open}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4"></div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </AuthenticatedPage>
  );
}
