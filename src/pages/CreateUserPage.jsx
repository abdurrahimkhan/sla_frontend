import React from 'react'
import MiddlewareProvider from '../middleware/AuthMiddleware'
import BaseLayout from '../components/BaseLayout/BaseLayout'
import Container from '../components/Common/Container'
import CreateUser from '../components/UserManagement/CreateUser'

export default function CreateUserPage() {
  return (
    <MiddlewareProvider>
        <BaseLayout >
            <Container>
                <CreateUser />
            </Container>
        </BaseLayout>
    </MiddlewareProvider>
)
}
