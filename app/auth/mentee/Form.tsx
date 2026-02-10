'use client'
import * as Auth from "@/styles/pages/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Stack, Txt, Input } from "@/components/common";
import { Icon, Line, Button } from '@/styles/common';
import { EnvelopIcon, LockIcon, GoogleIcon, AppleIcon, InfoIcon, PeopleIcon, ShieldIcon, DatabaseIcon } from "@/asset/icons";
import { api } from "@/lib/api";

interface MenteeAuthFormProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const MenteeAuthForm = ({ isLogin, setIsLogin }: MenteeAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onClickLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력하세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const form = new URLSearchParams();
      form.set('grant_type', '');
      form.set('username', email);
      form.set('password', password);
      form.set('scope', '');
      form.set('client_id', '');
      form.set('client_secret', '');

      const response = await fetch('http://blaybum.haeyul.cloud:8000/auth/jwt/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: form.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(data?.detail) ? data.detail[0]?.msg : null;
        throw new Error(detail || '로그인에 실패했습니다');
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('access_token', data.access_token);
      storage.setItem('refresh_token', data.refresh_token);
      storage.setItem('token_type', data.token_type);
      
      router.push('/mentee');
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const onClickRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    if (password.length < 3) {
      setError('비밀번호는 3자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      await api.auth.register({
        email,
        password,
        username: username || undefined,
        full_name: fullName || undefined,
        role: 'mentee',
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('REGISTER_USER_ALREADY_EXISTS')) {
        setError('이미 가입된 이메일입니다.');
      } else if (err.message?.includes('REGISTER_INVALID_PASSWORD')) {
        setError('비밀번호 형식이 올바르지 않습니다.');
      } else {
        setError('회원가입에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClickOauthGoogle = async () => {
    try {
      const { authorization_url } = await api.auth.googleAuthorize();
      window.location.href = authorization_url;
    } catch (error) {
      console.error(error);
      alert('구글 로그인 연결에 실패했어요.');
    }
  }

  const onClickOauthApple = async () => {
    try {
      const { authorization_url } = await api.auth.kakaoAuthorize();
      window.location.href = authorization_url;
    } catch (error) {
      console.error(error);
      alert('Apple 로그인을 대신할 카카오 연동에 실패했어요.');
    }
  }

  if (success) {
    return (
      <Auth.Form gap="xxxl" align="center">
        <Stack gap="xl" align="center" width="100%">
          <div style={{ fontSize: '64px' }}>🎉</div>
          <Txt as="h2" size="title" weight="regular">
            회원가입 완료!
          </Txt>
          <Txt as="p" weight="light" color="secondary">
            가입이 완료되었습니다. 이제 로그인하여 학습을 시작하세요.
          </Txt>
          <Button size="md" color="primary" onClick={() => setIsLogin(true)}>
            로그인하기
          </Button>
        </Stack>
      </Auth.Form>
    );
  }

  return (
    <Auth.Form gap='xxxl' align='center'>
      <Stack gap='xl' width='100%'>
        <Stack>
          <Txt as='h2' size='title' weight='regular'> 
            {isLogin ? '멘티 로그인' : '멘티 회원가입'} 
          </Txt>
          <Txt as='p' weight='light' color='secondary'> 
            {isLogin ? '학습 여정을 계속하세요' : '블레이범에 오신 것을 환영합니다'} 
          </Txt>
        </Stack>
        <Stack gap='xl' align='center' width='100%'>
          <Stack gap='md' align='flex-start' width='100%'>
            <Stack gap='xs' width='100%'>
              <Txt as='p' weight='light'> 이메일 </Txt>
              <Input
                icon={<EnvelopIcon size={20} />}
                placeholder='이메일을 입력하세요'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Stack>
            
            {!isLogin && (
              <>
                <Stack gap='xs' width='100%'>
                  <Txt as='p' weight='light'> 사용자명 (선택) </Txt>
                  <Input
                    icon={<PeopleIcon size={20} />}
                    placeholder='사용자명을 입력하세요'
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </Stack>
                <Stack gap='xs' width='100%'>
                  <Txt as='p' weight='light'> 이름 (선택) </Txt>
                  <Input
                    icon={<PeopleIcon size={20} />}
                    placeholder='이름을 입력하세요'
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </Stack>
              </>
            )}
            
            <Stack gap='xs' width='100%'>
              <Txt as='p' weight='light'> 비밀번호 </Txt>
              <Input
                type='password'
                icon={<LockIcon size={20} />}
                placeholder='비밀번호를 입력하세요'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Stack>
            
            {!isLogin && (
              <Stack gap='xs' width='100%'>
                <Txt as='p' weight='light'> 비밀번호 확인 </Txt>
                <Input
                  type='password'
                  icon={<LockIcon size={20} />}
                  placeholder='비밀번호를 다시 입력하세요'
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Stack>
            )}
            
            {isLogin && (
              <Row gap='sm' align='center'>
                <Auth.Checkbox
                  type='checkbox'
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                <Txt as='p' weight='light'> 로그인 상태 유지 </Txt>
              </Row>
            )}
          </Stack>
          
          <Button 
            size='md' 
            color='primary' 
            onClick={isLogin ? onClickLogin : onClickRegister}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
          </Button>
          
          {error && (
            <Txt as='p' weight='light' color='highlight'> {error} </Txt>
          )}
          
          <Row justify='center' align='center' gap='xs'>
            <Txt as='p' size='caption' weight='light' color='secondary'>
              {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            </Txt>
            <Txt 
              as='p' 
              size='caption' 
              weight='light' 
              color='highlight' 
              style={{cursor: 'pointer'}}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? '회원가입' : '로그인'}
            </Txt>
          </Row>
        </Stack>
      </Stack>
      
      <Row gap='lg' align='center' width='100%'>
        <Line />
        <Txt as='p' weight='light' color='secondary'> 또는 </Txt>
        <Line />
      </Row>
      
      <Stack gap='md' width='100%'>
        <Button size='md' color='muted' onClick={onClickOauthGoogle}>
          <GoogleIcon size={20} />
          <Txt as='p' weight='light'> Google </Txt>
        </Button>
        <Button size='md' color='muted' onClick={onClickOauthApple}>
          <AppleIcon size={20} />
          <Txt as='p' weight='light'> Kakao </Txt>
        </Button>
      </Stack>
      
      <Row width='100%'> <Line /> </Row>
      
      <Auth.Info gap='lg'>
        <Icon size='medium' color='muted'> <InfoIcon size={24} /> </Icon>
        <Stack gap='xs'>
          <Txt as='p' size='subtitle'> 처음 사용하시나요?</Txt>
          <Txt as='p' weight='light' color='secondary'> 학습을 시작하려면 회원가입을 진행해주세요 </Txt>
          <Txt as='p' weight='light' color='highlight'> 학습 지원팀에 문의하기 </Txt>
        </Stack>
      </Auth.Info>
      
      <Row gap='xxl'>
        <Row align='center' gap='sm'>
          <LockIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> SSL </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <DatabaseIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 데이터 암호화 </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <ShieldIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 개인정보 보호 </Txt>
        </Row>
      </Row>
    </Auth.Form>
  );
}

export default MenteeAuthForm;