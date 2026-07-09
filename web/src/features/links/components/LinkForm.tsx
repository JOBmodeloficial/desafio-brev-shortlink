import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { ApiError } from '../../../lib/http';
import { useCreateLink } from '../hooks';
import { linkFormSchema, type LinkFormValues } from '../schemas';

export function LinkForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: { originalUrl: '', shortUrl: '' },
  });

  const createLink = useCreateLink();
  const [conflictError, setConflictError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setConflictError(null);
    try {
      await createLink.mutateAsync({
        originalUrl: values.originalUrl,
        shortUrl: values.shortUrl || undefined,
      });
      reset({ originalUrl: '', shortUrl: '' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setConflictError('Essa URL encurtada já existe.');
      } else {
        setConflictError('Não foi possível salvar o link. Tente novamente.');
      }
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded border border-border bg-surface p-6"
      aria-label="Novo link"
    >
      <h2 className="text-lg font-bold">Novo link</h2>

      <Input
        label="Link original"
        placeholder="www.exemplo.com.br"
        error={errors.originalUrl?.message}
        {...register('originalUrl')}
      />

      <Input
        label="Link encurtado"
        prefix="brev.ly/"
        error={errors.shortUrl?.message ?? conflictError ?? undefined}
        {...register('shortUrl')}
      />

      <Button type="submit" fullWidth loading={createLink.isPending}>
        Salvar link
      </Button>
    </form>
  );
}
