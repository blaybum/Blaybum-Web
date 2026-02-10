'use client'
import * as Auth from "@/styles/pages/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Stack, Txt, Input } from "@/components/common";
import { Icon, Line, Button } from '@/styles/common';
import { EnvelopIcon, LockIcon, GoogleIcon, AppleIcon, InfoIcon, ShieldIcon, DatabaseIcon } from "@/asset/icons";
import { api } from "@/lib/api";

const Form = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ remember, setRemember ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');
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
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

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

  const onClickForgotPassword = async () => {
    const emailInput = window.prompt('비밀번호 재설정 이메일을 받을 주소를 입력해주세요.', email);
    if (!emailInput) return;
    await api.auth.forgotPassword(emailInput);
    alert('재설정 안내 메일을 보냈어요.');
  };

  const onClickRegister = () => {
    router.push('/auth/register');
  };

  const onClickVerify = async () => {
    const emailInput = window.prompt('인증 링크를 받을 이메일을 입력해주세요.', email);
    if (!emailInput) return;
    await api.auth.requestVerifyToken(emailInput);
    const tokenInput = window.prompt('받은 인증 토큰을 입력해주세요.');
    if (!tokenInput) return;
    await api.auth.verify(tokenInput);
    alert('이메일 인증이 완료되었습니다.');
  };

  const onClickResetPassword = async () => {
    const tokenInput = window.prompt('재설정 토큰을 입력해주세요.');
    if (!tokenInput) return;
    const passwordInput = window.prompt('새 비밀번호를 입력해주세요.');
    if (!passwordInput) return;
    await api.auth.resetPassword(tokenInput, passwordInput);
    alert('비밀번호가 변경되었습니다.');
  };

  const onClickOAuthCallbackTest = async (provider: 'google' | 'kakao' | 'google-associate' | 'kakao-associate') => {
    const code = window.prompt('code 값을 입력해주세요.');
    const state = window.prompt('state 값을 입력해주세요 (선택).') ?? undefined;
    if (!code) return;
    if (provider === 'google') await api.auth.googleCallback({ code, state });
    if (provider === 'kakao') await api.auth.kakaoCallback({ code, state });
    if (provider === 'google-associate') await api.auth.googleAssociateCallback({ code, state });
    if (provider === 'kakao-associate') await api.auth.kakaoAssociateCallback({ code, state });
    alert('OAuth 콜백 요청을 보냈어요.');
  };

  return (
    <Auth.Form gap='xxxl' align='center'>
      <Stack gap='xl' width='100%'>
        <Stack>
          <Txt as='h2' size='title' weight='regular'> 멘토 로그인 </Txt>
          <Txt as='p' weight='light' color='secondary'> 학생들의 성장을 함께 관리하세요 </Txt>
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
            <Row gap='sm' align='center'>
              <Auth.Checkbox
                type='checkbox'
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <Txt as='p' weight='light'> 로그인 상태 유지 </Txt>
            </Row>
          </Stack>
          <Button size='md' color='primary' onClick={onClickLogin}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
          {error ? (
            <Txt as='p' weight='light' color='highlight'>{error}</Txt>
          ) : null}
          <Txt as='p' weight='light' color='secondary'> 비밀번호를 잊으셨나요? </Txt>
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
          <Txt as='p' weight='light'> Apple </Txt>
        </Button>
      </Stack>
      <Row width='100%'> <Line /> </Row>
      <Auth.Info gap='lg'>
        <Icon size='medium' color='muted'> <InfoIcon size={24} /> </Icon>
        <Stack gap='xs'>
          <Txt as='p' size='subtitle'> 처음 사용하시나요?</Txt>
          <Txt as='p' weight='light' color='secondary'> 관리자가 사용한 초대 이메일을 확인하시거나, 아래 연락처로 문의해주세요 </Txt>
          <Txt as='p' weight='light' color='highlight'> 지원팀에 문의하기 </Txt>
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
      <Row gap='sm' align='center'>
        <Txt as='p' weight='light' color='secondary'>소셜 연동:</Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => api.auth.googleAssociateAuthorize().then((res) => (window.location.href = res.authorization_url))} role='button' style={{ cursor: 'pointer' }}>
          Google 연동
        </Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => api.auth.kakaoAssociateAuthorize().then((res) => (window.location.href = res.authorization_url))} role='button' style={{ cursor: 'pointer' }}>
          Kakao 연동
        </Txt>
      </Row>
      <Row gap='sm' align='center'>
        <Txt as='p' weight='light' color='secondary'>OAuth 콜백 테스트:</Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => onClickOAuthCallbackTest('google')} role='button' style={{ cursor: 'pointer' }}>
          Google
        </Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => onClickOAuthCallbackTest('kakao')} role='button' style={{ cursor: 'pointer' }}>
          Kakao
        </Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => onClickOAuthCallbackTest('google-associate')} role='button' style={{ cursor: 'pointer' }}>
          Google 연동 콜백
        </Txt>
        <Txt as='p' weight='light' color='highlight' onClick={() => onClickOAuthCallbackTest('kakao-associate')} role='button' style={{ cursor: 'pointer' }}>
          Kakao 연동 콜백
        </Txt>
      </Row>
    </Auth.Form>
  );
}

export default Form;
