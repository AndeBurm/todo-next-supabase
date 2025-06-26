import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Мокаем supabase до импорта компонента
vi.mock('@/lib/supabase', () => ({
    supabase: { auth: { signInWithPassword: vi.fn() } },
}));

import { supabase } from '@/lib/supabase';
import { LoginForm } from './login-form';
import { useRouter } from 'next/navigation';
import React from 'react';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

const mockPush = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.signInWithPassword as any).mockReset();
    (useRouter as unknown as vi.Mock).mockReturnValue({ push: mockPush });
});

describe('LoginForm', () => {
    it('рендерит форму', () => {
        render(<LoginForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', { name: /login/i })[0]
        ).toBeInTheDocument();
        expect(screen.getAllByTestId('login-form')[0]).toBeInTheDocument();
    });

    it('блокирует кнопку при isLoading', async () => {
        (supabase.auth.signInWithPassword as any).mockImplementation(
            () => new Promise(() => {})
        ); // Promise never resolves
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('login-form')[0]);
        // Ждём появления текста "Logging in..."
        const button = await screen.findByText(/logging in/i);
        expect(button).toBeDisabled();
    });

    it('показывает ошибку при неудачном логине', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            error: new Error('fail'),
        });
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('login-form')[0]);
        await waitFor(() => {
            expect(screen.getByText(/fail/i)).toBeInTheDocument();
        });
    });

    it('редиректит при успешном логине', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            error: null,
        });
        render(<LoginForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('login-form')[0]);
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/protected');
        });
    });
});
