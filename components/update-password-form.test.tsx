import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('@/lib/supabase', () => ({
    supabase: { auth: { updateUser: vi.fn() } },
}));

import { supabase } from '@/lib/supabase';
import { UpdatePasswordForm } from './update-password-form';
import { useRouter } from 'next/navigation';
import React from 'react';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

const mockPush = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.updateUser as any).mockReset();
    (useRouter as unknown as vi.Mock).mockReturnValue({ push: mockPush });
});

describe('UpdatePasswordForm', () => {
    it('рендерит форму', () => {
        render(<UpdatePasswordForm />);
        expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
        expect(
            screen.getAllByRole('button', { name: /save new password/i })[0]
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('update-password-form')[0]
        ).toBeInTheDocument();
    });

    it('показывает ошибку при неудачной смене пароля', async () => {
        (supabase.auth.updateUser as any).mockResolvedValueOnce({
            error: new Error('fail'),
        });
        render(<UpdatePasswordForm />);
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('update-password-form')[0]);
        await waitFor(() => {
            expect(screen.getByText(/fail/i)).toBeInTheDocument();
        });
    });

    it('редиректит при успешной смене пароля', async () => {
        (supabase.auth.updateUser as any).mockResolvedValueOnce({
            error: null,
        });
        render(<UpdatePasswordForm />);
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('update-password-form')[0]);
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/protected');
        });
    });

    it('блокирует кнопку при isLoading', async () => {
        (supabase.auth.updateUser as any).mockImplementation(
            () => new Promise(() => {})
        );
        render(<UpdatePasswordForm />);
        fireEvent.change(screen.getByLabelText(/^new password$/i), {
            target: { value: '123' },
        });
        fireEvent.submit(screen.getAllByTestId('update-password-form')[0]);
        const button = await screen.findByText(/saving/i);
        expect(button).toBeDisabled();
    });
});
