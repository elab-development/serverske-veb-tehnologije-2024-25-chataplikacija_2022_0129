import { useState } from 'react';
import InputError from '../../components/input-error';
import TextLink from '../../components/text-link';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../../context/auth-provider';
import { useNavigate } from 'react-router-dom';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { AxiosError } from 'axios';
import type { ValidationError } from '../../types';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<CheckedState>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState<boolean>(false);

    const handleSubmit = async(e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await login({email, password}, remember === true);
            navigate('/home');
        } catch (error: any) {
            const axiosError = error as AxiosError<ValidationError>;
            if(axiosError.response?.data?.errors){
                const validationErrors: Record<string, string> = {};
                Object.entries(axiosError.response.data.errors).forEach(([key, messages]) => {
                    validationErrors[key] = messages[0];
                });
                setErrors(validationErrors);
            }
            else{
                setErrors({
                    general: axiosError.response?.data?.message || 'Registration failed',
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <h1 className="sr-only">Log in</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink to="/forgot-password" className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} checked={remember} onCheckedChange={setRemember} />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing} data-test="login-button">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <TextLink to="/register" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
