import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  Users,
  Vote,
  BarChart3,
  Power,
  PowerOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoting } from '@/contexts/VotingContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    candidates,
    addCandidate,
    removeCandidate,
    votedUsers,
    isAdmin,
    setIsAdmin,
    votingActive,
    setVotingActive,
  } = useVoting();

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: 'Student President',
    image: '',
    department: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isAdmin) {
    navigate('/admin-login');
    return null;
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.department) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addCandidate({
      ...newCandidate,
      image: newCandidate.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newCandidate.name}`,
    });

    toast({
      title: 'Candidate Added',
      description: `${newCandidate.name} has been added successfully.`,
    });

    setNewCandidate({
      name: '',
      position: 'Student President',
      image: '',
      department: '',
    });
    setDialogOpen(false);
  };

  const handleRemoveCandidate = (id: string, name: string) => {
    removeCandidate(id);
    toast({
      title: 'Candidate Removed',
      description: `${name} has been removed from the election.`,
    });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('/');
  };

  const toggleVoting = () => {
    setVotingActive(!votingActive);
    toast({
      title: votingActive ? 'Voting Stopped' : 'Voting Started',
      description: votingActive
        ? 'The election has been paused.'
        : 'Students can now cast their votes.',
    });
  };

  return (
    <div className="min-h-screen gradient-hero pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            Manage candidates and monitor election progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <Users className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {candidates.length}
            </p>
            <p className="text-sm text-muted-foreground">Candidates</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <Vote className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {votedUsers.length}
            </p>
            <p className="text-sm text-muted-foreground">Voters</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <BarChart3 className="h-6 w-6 text-primary" />
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {totalVotes}
            </p>
            <p className="text-sm text-muted-foreground">Total Votes</p>
          </div>
          <div
            className={`rounded-2xl p-5 shadow-card ${
              votingActive ? 'bg-primary/10' : 'bg-destructive/10'
            }`}
          >
            {votingActive ? (
              <Power className="h-6 w-6 text-primary" />
            ) : (
              <PowerOff className="h-6 w-6 text-destructive" />
            )}
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {votingActive ? 'Active' : 'Paused'}
            </p>
            <p className="text-sm text-muted-foreground">Status</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Candidate Name *"
                  value={newCandidate.name}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Department *"
                  value={newCandidate.department}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, department: e.target.value })
                  }
                />
                <Input
                  placeholder="Image URL (optional)"
                  value={newCandidate.image}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, image: e.target.value })
                  }
                />
                <Button onClick={handleAddCandidate} variant="hero" className="w-full">
                  Add Candidate
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={toggleVoting}
            variant={votingActive ? 'destructive' : 'success'}
            size="lg"
          >
            {votingActive ? (
              <>
                <PowerOff className="mr-2 h-5 w-5" />
                Stop Voting
              </>
            ) : (
              <>
                <Power className="mr-2 h-5 w-5" />
                Start Voting
              </>
            )}
          </Button>

          <Button onClick={() => navigate('/results')} variant="glass" size="lg">
            <BarChart3 className="mr-2 h-5 w-5" />
            View Results
          </Button>
        </div>

        {/* Candidates List */}
        <div className="mt-8">
          <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
            Registered Candidates
          </h3>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card"
              >
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.department} • {candidate.votes} votes
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Candidate?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {candidate.name}? This action
                        cannot be undone and all their votes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
