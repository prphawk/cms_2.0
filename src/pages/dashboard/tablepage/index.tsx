import { Payment, columns } from '~/components/table/columns';
import { DataTable } from '~/components/table/data-table';
import { api } from '~/utils/api';

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52a',
      amount: 200,
      status: 'processing',
      email: 'b@example.com',
    },
    {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      email: 'example@gmail.com',
    },
    {
      id: '728ed52d',
      amount: 300,
      status: 'success',
      email: 'a@example.com',
    },
    // ...
  ];
}

export default function DemoPage() {
  const data = getData();

  const { data: commData, isLoading, isError } = api.committee.getAllActive.useQuery();

  if (isError) {
    return <span>Error: sowwyyyy</span>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      <div className="text-black">
        {commData?.map((e, index) => (
          <p key={index}>Committee: {e.name}</p>
        ))}
      </div>
    </div>
  );
}
