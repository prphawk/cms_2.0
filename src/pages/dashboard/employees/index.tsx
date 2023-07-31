import AuthenticatedPage from '~/components/authenticated-page'
import LoadingLayout from '~/components/loading-layout'
import PageLayout, { TextLayout } from '~/layout'
import { api } from '~/utils/api'

export default function Employees() {
  const { data, isLoading, isError } = api.employee.getAllActive.useQuery()

  if (isError) {
    return <span>Error: sowwyyyy</span>
  }

  return (
    <AuthenticatedPage>
      {/* TODO use suspense here while it loads? */}
      <LoadingLayout loading={isLoading}>
        <div>
          <TextLayout>
            <h3>Employees page!</h3>
          </TextLayout>
          <div className="text-white">
            {data?.map((e, index) => (
              <p key={index}>
                Employee: {e.name} - Committees: {e.committees.length}
              </p>
            ))}
          </div>
        </div>
      </LoadingLayout>
    </AuthenticatedPage>
  )
}
