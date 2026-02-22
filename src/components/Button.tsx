import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 btn-magnetic overflow-hidden relative group';

    const variants = {
      primary: 'bg-brand-accent text-brand-primary hover:bg-opacity-90',
      secondary: 'bg-brand-primary text-brand-background hover:bg-opacity-90',
      outline:
        'border border-brand-text/10 bg-transparent text-brand-text hover:bg-brand-text/5',
      ghost: 'bg-transparent text-brand-text hover:bg-brand-text/5',
    };

    const sizes = {
      sm: 'text-sm h-9 px-4',
      md: 'text-base h-11 px-6',
      lg: 'text-lg h-14 px-8',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {/* Sliding background layer for primary buttons to give that extra luxury touch */}
        {variant === 'primary' && (
           <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></span>
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
