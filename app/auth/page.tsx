'use client'
import { Row } from '@/components';
import { Container } from '@/styles/pages/auth';
import Panel from './Panel';
import Form from './Form'

const Login = () => {
  return (
    <Container align='stretch'>
      <Panel />
      <Form />
    </Container>
  );
}

export default Login;