import Link from 'next/link';
import FestivalSelector from '../../components/FestivalSelector';

export default function FestivalMatches() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="text-sm hover:underline"
          >
            ← Back to Stats
          </Link>
          <h1 className="text-2xl font-bold">Festival Lineup Matches</h1>
        </div>
        <FestivalSelector />
      </div>
    </div>
  );
} 