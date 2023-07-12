import { PropsWithChildren } from 'react';
import { TextLayout } from '~/layout';

export default function LoadingLayout(props: PropsWithChildren & { loading?: boolean }) {
  // You can add any UI inside Loading, including a Skeleton.
  return props.loading ? (
    <TextLayout>
      <h3>Loading...</h3>
    </TextLayout>
  ) : (
    <>{props.children}</>
  );
}
