import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { cn } from '../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, prefix, error, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-wide text-subtle">
          {label}
        </label>
      )}

      <div
        className={cn(
          'flex h-12 items-center rounded border bg-surface-2 px-4 focus-within:border-purple',
          error ? 'border-red' : 'border-border',
        )}
      >
        {prefix && <span className="text-md text-muted">{prefix}</span>}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-full w-full bg-transparent text-md text-fg outline-none placeholder:text-muted',
            className,
          )}
          {...props}
        />
      </div>

      {error && (
        <span id={errorId} className="text-sm text-red">
          {error}
        </span>
      )}
    </div>
  );
});
