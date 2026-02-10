'use client'
import { useState } from 'react';
import { Container } from '@/styles/pages/auth';
import MentorAuthPanel from './Panel';
import MentorAuthForm from './Form';

const MentorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <Container align='stretch'>
      <MentorAuthPanel />
      <MentorAuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </Container>
  );
}

export default MentorAuth;