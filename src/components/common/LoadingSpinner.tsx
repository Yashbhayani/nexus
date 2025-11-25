import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ message = "Loading...", fullPage = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        {content}
      </div>
    );
  }

  return content;
}
