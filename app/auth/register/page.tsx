'use client';
import * as Auth from '@/styles/pages/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Row, Stack, Txt, Input } from '@/components/common';
import { Icon, Line, Button } from '@/styles/common';
import { EnvelopIcon, LockIcon, InfoIcon, FilterIcon } from '@/asset/icons';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const onClickRegister = async (event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        event?.preventDefault();
        setError(null);

        // Validation
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

    if (success) {
        return (
            <Auth.Form gap="xxxl" align="center">
                <Stack gap="xl" align="center" width="100%">
                    <div style={{ fontSize: '64px' }}>🎉</div>
                    <Txt as="h2" size="title" weight="regular">
                        회원가입 완료!
                    </Txt>
                    <Txt as="p" weight="light" color="secondary">
                        가입이 완료되었습니다. 로그인하여 서비스를 이용하세요.
                    </Txt>
                    <Button size='md' color="primary" onClick={() => router.push('/auth')}>
                        로그인 페이지로 이동
                    </Button>
                </Stack>
            </Auth.Form>
        );
    }

    return (
        <Auth.Form gap="xxxl" align="center">
            <Stack gap="xl" width="100%">
                <Stack>
                    <Txt as="h2" size="title" weight="regular">
                        회원가입
                    </Txt>
                    <Txt as="p" weight="light" color="secondary">
                        블레이범에 오신 것을 환영합니다
                    </Txt>
                </Stack>

                {error && (
                    <div
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            color: '#ef4444',
                            fontSize: '14px',
                        }}
                    >
                        {error}
                    </div>
                )}

                <Stack gap="xl" align="center" width="100%">
                    <Stack gap="md" align="flex-start" width="100%">
                        <Stack gap="xs" width="100%">
                            <Txt as="p" weight="light">
                                이메일 *
                            </Txt>
                            <Input
                                icon={<EnvelopIcon size={20} />}
                                placeholder="이메일을 입력하세요"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Stack>
                        <Stack gap="xs" width="100%">
                            <Txt as="p" weight="light">
                                비밀번호 *
                            </Txt>
                            <Input
                                type="password"
                                icon={<LockIcon size={20} />}
                                placeholder="비밀번호를 입력하세요 (3자 이상)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Stack>
                        <Stack gap="xs" width="100%">
                            <Txt as="p" weight="light">
                                비밀번호 확인 *
                            </Txt>
                            <Input
                                type="password"
                                icon={<LockIcon size={20} />}
                                placeholder="비밀번호를 다시 입력하세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Stack>
                        <Row width="100%">
                            <Line />
                        </Row>
                        <Stack gap="xs" width="100%">
                            <Txt as="p" weight="light">
                                닉네임
                            </Txt>
                            <Input
                                icon={<FilterIcon size={20} />}
                                placeholder="닉네임 (선택)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Stack>
                        <Stack gap="xs" width="100%">
                            <Txt as="p" weight="light">
                                이름
                            </Txt>
                            <Input
                                icon={<FilterIcon size={20} />}
                                placeholder="실명 (선택)"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </Stack>
                    </Stack>
                    <Button size='md' color="primary" disabled={isLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        onClickRegister();
                    }}>
                        {isLoading ? '가입 중...' : '회원가입'}
                    </Button>
                </Stack>
            </Stack>

            <Row gap="md" align="center">
                <Txt as="p" weight="light" color="secondary">
                    이미 계정이 있으신가요?
                </Txt>
                <Link href="/auth">
                    <Txt as="p" weight="light" color="highlight" style={{ cursor: 'pointer' }}>
                        로그인
                    </Txt>
                </Link>
            </Row>

            <Auth.Info gap="lg">
                <Icon size="medium" color="muted">
                    <InfoIcon size={24} />
                </Icon>
                <Stack gap="xs">
                    <Txt as="p" size="subtitle">
                        안전한 가입
                    </Txt>
                    <Txt as="p" weight="light" color="secondary">
                        개인정보는 암호화되어 안전하게 보관됩니다
                    </Txt>
                </Stack>
            </Auth.Info>
        </Auth.Form>
    );
}
