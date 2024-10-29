import React from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import CalendarComponent from '../components/TicketManagement/CalendarComponent/Calendar'

export default function CalendarPage() {
  return (
    <MiddlewareProvider>
      <BaseLayout >
        <Container>
          <CalendarComponent />
        </Container>
      </BaseLayout>
    </MiddlewareProvider>
  )
}
