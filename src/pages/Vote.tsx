import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CandidateCard } from '@/components/CandidateCard';
import { useVoting } from '@/contexts/VotingContext';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Vote = () => {
  const navigate = useNavigate();
  const { candidates, currentUser, castVote, setCurrentUser, votingActive } = useVoting();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  if (!currentUser) {
    navigate('/user-login');
    return null;
  }

  if (!votingActive) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-hero">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Voting is Currently Closed
          </h2>
          <p className="mt-2 text-muted-foreground">
            Please check back later or contact the administrator.
          </p>
          <Button onClick={() => navigate('/')} variant="hero" className="mt-6">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleVoteConfirm = () => {
    if (!selectedCandidate) return;
    
    const success = castVote(selectedCandidate);
    if (success) {
      setHasVoted(true);
      toast({
        title: 'Vote Cast Successfully!',
        description: 'Thank you for participating in the election.',
      });
    }
    setShowConfirm(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate);

  if (hasVoted || currentUser.hasVoted) {
    return (
      <div className="min-h-screen gradient-hero">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
          <div className="animate-scale-in text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full gradient-success shadow-lg">
              <Check className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              Thank You!
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Your vote has been recorded successfully.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Button onClick={() => navigate('/results')} variant="hero" size="lg">
                View Results
              </Button>
              <Button onClick={handleLogout} variant="glass" size="lg">
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        <div className="mt-8 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Cast Your Vote
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select a candidate to vote for Student President
          </p>
          <p className="mt-1 text-sm text-primary font-medium">
            Student ID: {currentUser.studentId}
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              className="cursor-pointer"
            >
              <CandidateCard
                candidate={candidate}
                isSelected={selectedCandidate === candidate.id}
              />
            </div>
          ))}
        </div>

        {selectedCandidate && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 p-4 backdrop-blur-lg animate-slide-up">
            <div className="container mx-auto flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected:</p>
                <p className="font-semibold text-foreground">
                  {selectedCandidateData?.name}
                </p>
              </div>
              <Button
                onClick={() => setShowConfirm(true)}
                variant="hero"
                size="lg"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirm Vote
              </Button>
            </div>
          </div>
        )}

        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to vote for{' '}
                <strong>{selectedCandidateData?.name}</strong>. This action
                cannot be undone. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVoteConfirm}>
                Yes, Cast My Vote
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Vote;
