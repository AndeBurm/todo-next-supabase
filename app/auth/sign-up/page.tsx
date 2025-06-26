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

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        //Проверяем совпадение паролей
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            setIsLoading(false);
            return;
        }

        //Проверяем минимальную длину пароля
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data.user) {
                setSuccess(true);
                //Автоматическое перенаправление на страницу todos
                setTimeout(() => {
                    router.push('/todos');
                }, 2000);
            }
        } catch (err) {
            setError('Произошла неожиданная ошибка');
            console.error('Ошибка регистрации', err);
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
                        Регистрация
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className='flex flex-col gap-6'
                        onSubmit={handleRegister}
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
                                placeholder='Минимум 6 символов'
                                className='transition-all focus:ring-2 focus:ring-primary/60'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='confirmPassword'>
                                Подтвердите пароль
                            </Label>
                            <Input
                                id='confirmPassword'
                                name='confirmPassword'
                                type='password'
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder='Повторите пароль'
                                className='transition-all focus:ring-2 focus:ring-primary/60'
                            />
                        </div>
                        {error && (
                            <div className='text-red-500 text-sm'>{error}</div>
                        )}
                        {success && (
                            <div className='text-green-600 text-sm'>
                                Регистрация успешна! Перенаправляем...
                            </div>
                        )}
                        <Button
                            type='submit'
                            className='w-full py-3 text-base font-semibold transition-all'
                            disabled={isLoading}
                        >
                            {isLoading ?
                                'Регистрируем...'
                            :   'Зарегистрироваться'}
                        </Button>
                        <div className='flex flex-col gap-2 text-center mt-2'>
                            <span className='text-sm text-muted-foreground'>
                                Уже есть аккаунт?{' '}
                                <a
                                    href='/auth/login'
                                    className='text-primary hover:underline transition'
                                >
                                    Войти
                                </a>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

