'use client'
import * as Auth from "@/styles/pages/auth";
import { useState } from "react";
import { Row, Stack, Txt, Input } from "@/components/common";
import { Icon, Line, Button } from '@/styles/common';
import { EnvelopIcon, LockIcon, GoogleIcon, AppleIcon, InfoIcon, ShieldIcon, DatabaseIcon } from "@/asset/icons";

const Form = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ remember, setRemember ] = useState(false);

  const onClickLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  const onClickOauthGoogle = () => {}

  const onClickOauthApple = () => {}

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
          <Button color='primary' onClick={onClickLogin}> 로그인 </Button>
          <Txt as='p' weight='light' color='secondary'> 비밀번호를 잊으셨나요? </Txt>
        </Stack>
      </Stack>
      <Row gap='lg' align='center' width='100%'>
        <Line />
        <Txt as='p' weight='light' color='secondary'> 또는 </Txt>
        <Line />
      </Row>
      <Stack gap='md' width='100%'>
        <Button color='muted' onClick={onClickOauthGoogle}>
          <GoogleIcon size={20} />
          <Txt as='p' weight='light'> Google </Txt>
        </Button>
        <Button color='muted' onClick={onClickOauthApple}>
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
    </Auth.Form>
  );
}

export default Form;