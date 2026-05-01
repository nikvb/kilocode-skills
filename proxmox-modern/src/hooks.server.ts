import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error }) => {
  const err = error as { message?: string; stack?: string } | null;
  console.error('[server error]', err?.message ?? error);
  if (err?.stack) console.error(err.stack);
  return { message: 'Something went wrong' };
};
