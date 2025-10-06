import { LoaderCircle } from 'lucide-react';
import InputError from '../../components/input-error';
import TextLink from '../../components/text-link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import AuthLayout from '../../layouts/auth-layout';
import { useState } from 'react';
import { useAuth } from '../../context/auth-provider';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { ValidationError } from '../../types';

export default function Register() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_confirmation, setPasswordConfirmation] = useState<string>('');

    const [processing, setProcessing] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await register({name, email, password, password_confirmation});
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
    }

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <h1 className="sr-only">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            name="name"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            name="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            name="password_confirmation"
                            placeholder="Confirm password"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} data-test="register-user-button">
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink to="/login" tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
