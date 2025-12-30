export interface Candidate {
  id: string;
  name: string;
  position: string;
  image: string;
  votes: number;
  department: string;
}

export interface User {
  id: string;
  studentId: string;
  name: string;
  hasVoted: boolean;
  department: string;
}

export interface VotingState {
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
}
