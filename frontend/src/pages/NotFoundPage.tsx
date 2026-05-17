import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 gap-3">
      <p className="text-7xl font-bold text-primary-600">404</p>
      <p className="text-xl font-semibold text-gray-900 dark:text-white">Page not found</p>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="md">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
