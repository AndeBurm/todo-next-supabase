'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                console.log(
                    '[AuthGuard] session:',
                    session,
                    'pathname:',
                    pathname
                );

                if (!session) {
                    if (pathname !== '/auth/login') {
                        setTimeout(() => {
                            router.push('/auth/login');
                        }, 200);
                    }
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                if (pathname !== '/auth/login') {
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 200);
                }
            } finally {
                setIsLoading(false);
                console.log(
                    '[AuthGuard] isLoading:',
                    isLoading,
                    'isAuthenticated:',
                    isAuthenticated
                );
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div>Загрузка...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
