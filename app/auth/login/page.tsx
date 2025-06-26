'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log('Sign in attempt:', { email, password });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.session || data.user) {
                router.push('/todos');
            }
        } catch (err) {
            setError('Произошла неожиданная ошибка');
            console.error('Ошибка входа:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-base-200 px-2'>
            <Card className='w-full max-w-md shadow-lg p-0 relative'>
                <div className='absolute top-3 right-3 z-10'>
                    <ThemeSwitcher />
                </div>
                <CardHeader>
                    <CardTitle className='text-2xl text-center'>
                        Вход в систему
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className='flex flex-col gap-6'
                        onSubmit={handleLogin}
                    >
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Введите email'
                                autoFocus
                                className='transition-all focus:ring-2 focus:ring-primary/60'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='password'>Пароль</Label>
                            <Input
                                id='password'
                                name='password'
                                type='password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Введите пароль'
                                className='transition-all focus:ring-2 focus:ring-primary/60'
                            />
                        </div>
                        {error && (
                            <div className='text-red-500 text-sm'>{error}</div>
                        )}
                        <Button
                            type='submit'
                            className='w-full py-3 text-base font-semibold transition-all'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Вхожу...' : 'Войти'}
                        </Button>
                        <div className='flex flex-col gap-2 text-center mt-2'>
                            <a
                                href='/auth/forgot-password'
                                className='text-sm text-primary hover:underline transition'
                            >
                                Забыли пароль?
                            </a>
                            <span className='text-sm text-muted-foreground'>
                                Нет аккаунта?{' '}
                                <a
                                    href='/auth/sign-up'
                                    className='text-primary hover:underline transition'
                                >
                                    Зарегистрироваться
                                </a>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

