import React from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import UserProfile from '../components/UserManagement/UserProfile'

export default function UserProfilePage() {
  return (
    <MiddlewareProvider>
      <BaseLayout >
        <Container>
          <UserProfile />
        </Container>
      </BaseLayout>
    </MiddlewareProvider>
  )
}
