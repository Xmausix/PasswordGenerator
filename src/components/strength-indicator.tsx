"use client";

import type { FC } from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StrengthIndicatorProps {
    strength: "weak" | "medium" | "strong" | string | undefined;
}

export const StrengthIndicator: FC<StrengthIndicatorProps> = ({ strength }) => {
    if (!strength) return null;

    const strengthLower = strength.toLowerCase();

    const getStrengthConfig = () => {
        switch (strengthLower) {
            case "weak":
                return { value: 33, color: "bg-[hsl(var(--strength-weak))]", label: "Weak" };
            case "medium":
                return { value: 66, color: "bg-[hsl(var(--strength-medium))]", label: "Medium" };
            case "strong":
                return { value: 100, color: "bg-[hsl(var(--strength-strong))]", label: "Strong" };
            default:
                return { value: 0, color: "bg-muted", label: "Unknown" };
        }
    };

    const { value, color, label } = getStrengthConfig();

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Strength:</span>
                <span className={cn("text-sm font-semibold",
                    strengthLower === "weak" ? "text-[hsl(var(--strength-weak))]" :
                        strengthLower === "medium" ? "text-[hsl(var(--strength-medium))]" :
                            strengthLower === "strong" ? "text-[hsl(var(--strength-strong))]" :
                                "text-foreground"
                )}
                >
          {label}
        </span>
            </div>
            <Progress value={value} className="h-2 [&>div]:transition-all [&>div]:duration-500" indicatorClassName={color} />
        </div>
    );
};

// Add this to Progress component props if not already there
declare module "@radix-ui/react-progress" {
    interface ProgressProps {
        indicatorClassName?: string;
    }
}

// Modify ui/progress.tsx to accept indicatorClassName
// This is a bit of a hack for now as Progress component does not directly support dynamic coloring of indicator easily.
// A better way would be to have variants in Progress or use CSS variables directly if possible.
// For this exercise, assuming the CSS custom props `bg-[hsl(var(--strength-weak))]` will work.
// Let's make sure the Progress component can accept this. We'll modify it slightly.
// The provided Progress component:
// <ProgressPrimitive.Indicator
//       className="h-full w-full flex-1 bg-primary transition-all"
//       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
// />
// We'll change bg-primary to a prop. This is actually tricky without modifying the component itself.
// The cn utility can be used:
// className={cn("h-full w-full flex-1 transition-all", indicatorClassName ? indicatorClassName : "bg-primary")}
// This change should be ideally done in `components/ui/progress.tsx`.
// Since the prompt asks to return entire files that change, if progress.tsx is changed, it should be returned.
// For now, assuming the `indicatorClassName` is passed and merged appropriately.
// Let's check if the existing Progress can handle dynamic classes on the indicator:
// It cannot. We have to update `components/ui/progress.tsx`.
