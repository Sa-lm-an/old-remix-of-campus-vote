import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Candidate, User } from '@/types/voting';

interface VotingContextType {
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  removeCandidate: (id: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  votedUsers: string[];
  castVote: (candidateId: string) => boolean;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  votingActive: boolean;
  setVotingActive: (value: boolean) => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const initialCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'Student President',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    votes: 45,
    department: 'Computer Science',
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'Student President',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    votes: 38,
    department: 'Engineering',
  },
  {
    id: '3',
    name: 'Emily Davis',
    position: 'Student President',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    votes: 52,
    department: 'Business',
  },
];

export function VotingProvider({ children }: { children: ReactNode }) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [votedUsers, setVotedUsers] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votingActive, setVotingActive] = useState(true);

  const addCandidate = (candidate: Omit<Candidate, 'id' | 'votes'>) => {
    const newCandidate: Candidate = {
      ...candidate,
      id: Date.now().toString(),
      votes: 0,
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const castVote = (candidateId: string): boolean => {
    if (!currentUser || votedUsers.includes(currentUser.studentId)) {
      return false;
    }

    setCandidates(
      candidates.map((c) =>
        c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
      )
    );
    setVotedUsers([...votedUsers, currentUser.studentId]);
    setCurrentUser({ ...currentUser, hasVoted: true });
    return true;
  };

  return (
    <VotingContext.Provider
      value={{
        candidates,
        addCandidate,
        removeCandidate,
        currentUser,
        setCurrentUser,
        votedUsers,
        castVote,
        isAdmin,
        setIsAdmin,
        votingActive,
        setVotingActive,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}
