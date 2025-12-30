import { Candidate } from '@/types/voting';
import { Button } from '@/components/ui/button';
import { Check, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
  onVote?: () => void;
  hasVoted?: boolean;
  showVotes?: boolean;
  isSelected?: boolean;
}

export function CandidateCard({
  candidate,
  onVote,
  hasVoted,
  showVotes,
  isSelected,
}: CandidateCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-elevated animate-scale-in',
        isSelected && 'ring-2 ring-primary shadow-glow'
      )}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={candidate.image}
          alt={candidate.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-3">
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
            {candidate.department}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-primary-foreground">
          {candidate.name}
        </h3>
        <p className="text-sm text-primary-foreground/80">{candidate.position}</p>
        
        {showVotes && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary-foreground/20">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${Math.min(candidate.votes * 2, 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-primary-foreground">
              {candidate.votes}
            </span>
          </div>
        )}
        
        {onVote && !hasVoted && (
          <Button
            onClick={onVote}
            variant="hero"
            className="mt-4 w-full"
          >
            <Vote className="mr-2 h-4 w-4" />
            Vote
          </Button>
        )}
        
        {isSelected && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/90 py-2 text-primary-foreground">
            <Check className="h-5 w-5" />
            <span className="font-medium">Selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
