import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@/lib/supabase', () => ({
    supabase: { auth: { signUp: vi.fn() } },
}));

import { supabase } from '@/lib/supabase';
import { SignUpForm } from './sign-up-form';
import { useRouter } from 'next/navigation';
import React from 'react';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

const mockPush = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.signUp as any).mockReset();
    (useRouter as unknown as vi.Mock).mockReturnValue({ push: mockPush });
});

describe('SignUpForm', () => {
    it('рендерит форму', () => {
        render(<SignUpForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', { name: /sign up/i })[0]
        ).toBeInTheDocument();
        expect(screen.getAllByTestId('sign-up-form')[0]).toBeInTheDocument();
    });

    it('показывает ошибку при несовпадении паролей', async () => {
        render(<SignUpForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: '123' },
        });
        fireEvent.change(screen.getByLabelText(/repeat password/i), {
            target: { value: '456' },
        });
        fireEvent.submit(screen.getAllByTestId('sign-up-form')[0]);
        await waitFor(() => {
            expect(
                screen.getByText(/passwords do not match/i)
            ).toBeInTheDocument();
        });
    });

    it('показывает ошибку при неудачной регистрации', async () => {
        (supabase.auth.signUp as any).mockResolvedValueOnce({
            error: new Error('fail'),
        });
        render(<SignUpForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: '123' },
        });
        fireEvent.change(screen.getByLabelText(/repeat password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('sign-up-form')[0]);
        await waitFor(() => {
            expect(screen.getByText(/fail/i)).toBeInTheDocument();
        });
    });

    it('редиректит при успешной регистрации', async () => {
        (supabase.auth.signUp as any).mockResolvedValueOnce({ error: null });
        render(<SignUpForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: '123' },
        });
        fireEvent.change(screen.getByLabelText(/repeat password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('sign-up-form')[0]);
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/auth/sign-up-success');
        });
    });

    it('блокирует кнопку при isLoading', async () => {
        (supabase.auth.signUp as any).mockImplementation(
            () => new Promise(() => {})
        );
        render(<SignUpForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: '123' },
        });
        fireEvent.change(screen.getByLabelText(/repeat password/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('sign-up-form')[0]);
        const button = await screen.findByText(/creating an account/i);
        expect(button).toBeDisabled();
    });
});
