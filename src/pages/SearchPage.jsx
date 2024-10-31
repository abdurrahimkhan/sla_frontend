import React from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import SearchTicket from '../components/TicketManagement/SearchTicket/SearchTicket'

export default function SearchPage() {
  return (
    <MiddlewareProvider>
      <BaseLayout >
        <Container>
          <SearchTicket />
        </Container>
      </BaseLayout>
    </MiddlewareProvider>
  )
}
