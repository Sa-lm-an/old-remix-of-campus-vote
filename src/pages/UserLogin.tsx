import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Send, ShieldCheck, Fingerprint, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IdCardScanner } from '@/components/IdCardScanner';
import { OtpInput } from '@/components/OtpInput';
import { useVoting } from '@/contexts/VotingContext';
import { toast } from '@/hooks/use-toast';

type Step = 'scan' | 'otp';

const UserLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, setCurrentUser, votedUsers, isStudentRegistered, registeredStudents } = useVoting();
  const [step, setStep] = useState<Step>('scan');
  const redirectTo = searchParams.get('redirect') === 'nominate' ? '/nominate' : '/vote';

  useEffect(() => {
    if (currentUser) {
      navigate(redirectTo);
    }
  }, [currentUser, navigate, redirectTo]);
  const [student_id, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleIdScan = async (id: string) => {
    if (!isStudentRegistered(id)) {
      toast({
        title: 'Not Registered',
        description: 'Your student ID is not in the eligible voter list. Contact the admin.',
        variant: 'destructive',
      });
      return;
    }

    const student = registeredStudents.find(s => s.student_id === id);
    if (!student?.phone) {
      toast({
        title: 'Missing Phone Record',
        description: 'No phone number found for this ID. Contact the admin.',
        variant: 'destructive',
      });
      return;
    }

    setStudentId(id);
    setPhone(student.phone);

    if (votedUsers.includes(id) && redirectTo !== '/nominate') {
      toast({
        title: 'Already Voted',
        description: 'You have already cast your vote in this election.',
        variant: 'destructive',
      });
      return;
    }

    // Automatically transition to OTP
    setIsLoading(true);
    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    toast({
      title: 'OTP Sent',
      description: `A verification code has been sent to your registered phone ending in ${student.phone.slice(-3)}.`,
    });
    setStep('otp');
  };

  const handlePhoneSubmit = async () => {
    // This is now triggered automatically from handleIdScan or via Resend button
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: 'OTP Sent',
      description: 'A verification code has been sent to your phone.',
    });
    setStep('otp');
  };

  const handleOtpComplete = (otp: string) => {
    if (otp.length === 6) {
      const student = registeredStudents.find(s => s.student_id === student_id);
      setCurrentUser({
        id: Date.now().toString(),
        student_id: student_id,
        name: student?.name || 'Student User',
        hasVoted: votedUsers.includes(student_id),
        department: student?.department || 'General',
      });

      toast({
        title: 'Welcome!',
        description: 'You have been verified successfully.',
      });

      navigate(redirectTo);
    }
  };

  const stepIndex = ['scan', 'otp'].indexOf(step);
  const stepIcons = [Fingerprint, KeyRound];
  const stepLabels = ['Verify ID', 'OTP'];

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="pt-4" />

        <div className="mx-auto mt-8 max-w-md">
          {/* Progress Steps */}
          <div className="mb-10 flex items-center justify-center gap-6">
            {stepLabels.map((label, i) => {
              const Icon = stepIcons[i];
              const isCurrent = step === (i === 0 ? 'scan' : 'otp');
              const isCompleted = stepIndex > i;
              
              return (
                <div key={label} className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 ${isCurrent
                        ? 'bg-[#112250] text-white shadow-[0_0_20px_rgba(17,34,80,0.3)] scale-110 border-2 border-[#E0C58F]'
                        : isCompleted
                          ? 'bg-[#E0C58F] text-[#112250]'
                          : 'glass-card text-muted-foreground'
                        }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-bold ${isCurrent ? 'text-[#112250]' : 'text-muted-foreground'}`}>
                      {label}
                    </span>
                  </div>
                  {i < 1 && (
                    <div className={`w-16 h-0.5 rounded-full mb-6 transition-colors ${isCompleted ? 'bg-[#E0C58F]' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl glass-card p-8 animate-scale-in">
            {step === 'scan' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                    <ShieldCheck className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Verify Your Identity
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {isLoading ? "Fetching student record..." : "Enter your student ID to continue"}
                  </p>
                </div>
                {isLoading ? (
                   <div className="flex flex-col items-center justify-center py-10 space-y-4">
                      <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm font-medium text-muted-foreground">Simulating OTP delivery...</p>
                   </div>
                ) : (
                  <IdCardScanner onScan={handleIdScan} />
                )}
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                    <KeyRound className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Enter OTP
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Code sent to registered mobile *******{phone.slice(-3)}
                  </p>
                </div>

                <OtpInput onComplete={handleOtpComplete} />

                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive code?{' '}
                  <button
                    onClick={handlePhoneSubmit}
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
