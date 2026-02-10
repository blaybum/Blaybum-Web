'use client'

import { useState } from 'react';
import { Container } from '@/styles/pages/auth';
import MenteeAuthPanel from './Panel';
import MenteeAuthForm from './Form';

const MenteeAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container align='stretch'>
      <MenteeAuthPanel />
      <MenteeAuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
    </Container>
  );
}

export default MenteeAuth;