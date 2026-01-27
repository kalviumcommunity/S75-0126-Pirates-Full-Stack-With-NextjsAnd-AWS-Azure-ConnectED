'use client';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-semibold text-red-600">
        Oops! Something went wrong 😢
      </h2>

      <p className="mt-3 text-gray-600 max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>

      <button
        onClick={reset}
        className="mt-6 rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
