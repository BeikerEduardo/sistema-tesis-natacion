import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
type LoaderVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  destructive: 'text-destructive',
  outline: 'text-foreground',
  ghost: 'text-muted-foreground',
};

export function Loader({
  size = 'md',
  variant = 'primary',
  className,
  fullScreen = false,
  text,
}: LoaderProps) {
  const loader = (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2
        className={cn(
          'animate-spin',
          sizeMap[size],
          variantMap[variant]
        )}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
}

export function PageLoader({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
}

export function InlineLoader({ size = 'sm', variant = 'primary' }: { size?: LoaderSize; variant?: LoaderVariant }) {
  return <Loader size={size} variant={variant} className="inline-block" />;
}
