import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
    title: 'Aegis Pass - Secure Password Generator',
    description: 'Generate strong, memorable passwords with Aegis Pass, powered by AI.',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        </body>
        </html>
    );
}
