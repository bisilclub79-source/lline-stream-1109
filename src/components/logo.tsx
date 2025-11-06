import { Clapperboard } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Clapperboard className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight font-headline">
        CineStream
      </span>
    </div>
  );
}
