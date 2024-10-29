import React from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import PendingTickets from '../components/TicketManagement/PendingTickets/PendingTickets'
import TicketsFullView from '../components/Tables/TicketsFullView'

export default function PendingTicketsPage() {
  return (
    <MiddlewareProvider>
      <BaseLayout >
        <Container>
          <TicketsFullView />
        </Container>
      </BaseLayout>
    </MiddlewareProvider>
  )
}
