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

  return (
    <AuthenticatedPage>
      <PageLayout></PageLayout>
    </AuthenticatedPage>
  );
}
