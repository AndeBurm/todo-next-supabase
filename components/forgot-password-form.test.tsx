import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@/lib/supabase', () => ({
    supabase: { auth: { resetPasswordForEmail: vi.fn() } },
}));

import { supabase } from '@/lib/supabase';
import { ForgotPasswordForm } from './forgot-password-form';
import React from 'react';

beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.resetPasswordForEmail as any).mockReset();
});

describe('ForgotPasswordForm', () => {
    it('рендерит форму', () => {
        render(<ForgotPasswordForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', { name: /send reset email/i })[0]
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('forgot-password-form')[0]
        ).toBeInTheDocument();
    });

    it('показывает success при успешной отправке', async () => {
        (supabase.auth.resetPasswordForEmail as any).mockResolvedValueOnce({
            error: null,
        });
        render(<ForgotPasswordForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.submit(screen.getAllByTestId('forgot-password-form')[0]);
        await waitFor(() => {
            expect(screen.getByText(/check your email/i)).toBeInTheDocument();
        });
    });

    it('показывает ошибку при неудачной отправке', async () => {
        (supabase.auth.resetPasswordForEmail as any).mockResolvedValueOnce({
            error: new Error('fail'),
        });
        render(<ForgotPasswordForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.submit(screen.getAllByTestId('forgot-password-form')[0]);
        await waitFor(() => {
            expect(screen.getByText(/fail/i)).toBeInTheDocument();
        });
    });

    it('блокирует кнопку при isLoading', async () => {
        (supabase.auth.resetPasswordForEmail as any).mockImplementation(
            () => new Promise(() => {})
        );
        render(<ForgotPasswordForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'a@a.com' },
        });
        fireEvent.submit(screen.getAllByTestId('forgot-password-form')[0]);
        const button = await screen.findByText(/sending/i);
        expect(button).toBeDisabled();
    });
});
