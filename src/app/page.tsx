import { PasswordGenerator } from '@/components/password-generator';
import { ShieldCheckIcon } from 'lucide-react';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
            <div className="w-full max-w-md">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center mb-4">
                        <ShieldCheckIcon className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Aegis Pass
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Generate secure and memorable passwords with AI.
                    </p>
                </header>
                <PasswordGenerator />
                <footer className="mt-12 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Aegis Pass. Secure your digital life.</p>
                </footer>
            </div>
        </main>
    );
}
