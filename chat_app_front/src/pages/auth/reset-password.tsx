//import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
//import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token') || '';
    const emailParam = searchParams.get('email') || '';

    const [email] = useState(emailParam);
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await api.post('/reset-password', { token, email, password, password_confirmation });
            navigate('/login', {
                state: {
                    message: 'Password reset successfully',
                },
            });
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    general: error.response?.data?.message || 'Failed to reset password',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <h1 className='sr-only'>Reset password</h1>

            {errors.general && (
                <div className="mb-4 text-center text-sm font-medium text-red-600">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" autoComplete="email" value={email} className="mt-1 block w-full" readOnly />
                        <InputError message={errors.email?.[0]} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            autoFocus
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <InputError message={errors.password?.[0]} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            placeholder="Confirm password"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation?.[0]} className="mt-2" />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing} data-test="reset-password-button">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Reset password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
