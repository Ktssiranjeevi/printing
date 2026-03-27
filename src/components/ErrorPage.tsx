import { useRouteError, isRouteErrorResponse } from 'react-router';
import { Button } from './ui/button';
import '../styles/error-page.css';

export default function ErrorPage() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText || 'Page not found';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="error-page">
      <div className="error-page__card">
        <div className="error-page__header">
          <h1 className="error-page__title">
            {errorStatus === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h1>
          <p className="error-page__message">
            {errorStatus === 404
              ? "The page you're looking for doesn't exist."
              : "We're sorry, but something unexpected happened while loading this page."
            }
          </p>
          {errorStatus !== 404 && (
            <p className="error-page__details">
              Error: {errorMessage}
            </p>
          )}
        </div>
        <div className="error-page__actions">
          <Button
            onClick={() => window.location.href = '/'}
            className="error-page__button"
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="error-page__button"
          >
            Go Back
          </Button>
        </div>
        {error instanceof Error && (
          <details className="error-page__stack">
            <summary className="error-page__summary">
              Error Details (Development Only)
            </summary>
            <pre className="error-page__pre">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
