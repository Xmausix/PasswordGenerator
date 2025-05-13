"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestPassword, type SuggestPasswordInput, type SuggestPasswordOutput } from '@/ai/flows/suggest-password';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { StrengthIndicator } from '@/components/strength-indicator';
import { Sparkles, ClipboardCopy, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const passwordFormSchema = z.object({
    length: z.number().min(8, "Min 8 characters").max(128, "Max 128 characters").default(16),
    complexity: z.enum(["low", "medium", "high"]).default("medium"),
    keywords: z.string().optional(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordGenerator() {
    const [generatedPasswordInfo, setGeneratedPasswordInfo] = useState<SuggestPasswordOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            length: 16,
            complexity: "medium",
            keywords: "",
        },
    });

    // Watch length for real-time display next to slider
    const currentLength = form.watch("length");

    const onSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        setIsLoading(true);
        setError(null);
        setGeneratedPasswordInfo(null);
        try {
            const aiInput: SuggestPasswordInput = {
                length: data.length,
                complexity: data.complexity,
                ...(data.keywords && { keywords: data.keywords }),
            };
            const result = await suggestPassword(aiInput);
            setGeneratedPasswordInfo(result);
        } catch (e) {
            console.error("Error generating password:", e);
            setError("Failed to generate password. Please try again.");
            toast({
                title: "Error",
                description: "Failed to generate password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (generatedPasswordInfo?.password) {
            try {
                await navigator.clipboard.writeText(generatedPasswordInfo.password);
                setIsCopied(true);
                toast({
                    title: "Password Copied!",
                    description: "The generated password has been copied to your clipboard.",
                    action: <CheckCircle className="text-green-500" />,
                });
                setTimeout(() => setIsCopied(false), 2500);
            } catch (err) {
                toast({
                    title: "Copy Failed",
                    description: "Could not copy password to clipboard.",
                    variant: "destructive",
                });
            }
        }
    };

    // Effect to reset copy state if password changes
    useEffect(() => {
        setIsCopied(false);
    }, [generatedPasswordInfo?.password]);

    return (
        <Card className="w-full shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl">Customize Your Password</CardTitle>
                <CardDescription>
                    Adjust the settings below to generate a password tailored to your needs.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="length"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-1">
                                        <FormLabel>Password Length</FormLabel>
                                        <span className="text-sm font-medium text-primary">{currentLength} characters</span>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            min={8}
                                            max={64} /* Reduced max for slider usability, AI can handle higher */
                                            step={1}
                                            disabled={isLoading}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                            aria-label="Password length"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="complexity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Complexity</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger aria-label="Password complexity">
                                                <SelectValue placeholder="Select complexity level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Optional Keywords</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., favorite_pet_!@#"
                                            {...field}
                                            disabled={isLoading}
                                            aria-label="Optional keywords for password"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Include keywords to make the password more memorable (AI will incorporate them).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="flex items-center space-x-2 text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                                <AlertTriangle className="h-5 w-5" />
                                <p>{error}</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-stretch gap-4">
                        <Button type="submit" disabled={isLoading} className="w-full text-base py-6">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-5 w-5" />
                            )}
                            Generate Password
                        </Button>

                        {generatedPasswordInfo && (
                            <div className="mt-4 p-4 border border-dashed border-primary/50 rounded-lg bg-primary/5 space-y-3 animate-in fade-in-50 duration-500">
                                <div>
                                    <Label htmlFor="generatedPasswordOutput" className="text-xs text-muted-foreground">Generated Password:</Label>
                                    <div className="relative flex items-center mt-1">
                                        <Input
                                            id="generatedPasswordOutput"
                                            type="text"
                                            value={generatedPasswordInfo.password}
                                            readOnly
                                            className="pr-12 text-lg font-mono tracking-wider bg-background/30 border-border focus-visible:ring-primary"
                                            aria-label="Generated password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCopy}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                                            aria-label="Copy password to clipboard"
                                            title={isCopied ? "Copied!" : "Copy to clipboard"}
                                        >
                                            {isCopied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <ClipboardCopy className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </div>
                                <StrengthIndicator strength={generatedPasswordInfo.strength} />
                                {generatedPasswordInfo.reason && (
                                    <p className="text-xs text-muted-foreground italic">
                                        Reason: {generatedPasswordInfo.reason}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
