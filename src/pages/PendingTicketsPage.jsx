import React, { useEffect } from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import PendingTickets from '../components/TicketManagement/PendingTickets/PendingTickets'
import { useParams } from 'react-router-dom'

export default function PendingTicketsPage() {
  const { filter } = useParams();
  const [filterType, setFilterType] = React.useState(filter);

  useEffect(() => {
    if (!filterType) {
      if (filter) {
        setFilterType(filter)
      } else {
        setFilterType('Both')
      }
    }

  }, [filter])

  return (
    <MiddlewareProvider>
      <BaseLayout >
        <Container>
          {filterType &&
            <PendingTickets notification={true} type={filterType} />
          }
        </Container>
      </BaseLayout>
    </MiddlewareProvider>
  )
}
