import { useState } from 'react';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IdCardScannerProps {
  onScan: (studentId: string) => void;
}

export function IdCardScanner({ onScan }: IdCardScannerProps) {
  const [studentId, setStudentId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = async () => {
    if (!studentId.trim()) return;
    
    setIsScanning(true);
    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsScanning(false);
    setScanned(true);
    
    setTimeout(() => {
      onScan(studentId);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          'relative mx-auto flex h-48 w-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300',
          isScanning && 'border-primary bg-primary/5 animate-pulse-soft',
          scanned && 'border-primary bg-primary/10',
          !isScanning && !scanned && 'border-border bg-muted/50'
        )}
      >
        {scanned ? (
          <CheckCircle className="h-16 w-16 text-primary animate-scale-in" />
        ) : isScanning ? (
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        ) : (
          <CreditCard className="h-16 w-16 text-muted-foreground" />
        )}
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {scanned
            ? 'ID Card Verified!'
            : isScanning
            ? 'Scanning...'
            : 'Enter your Student ID'}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter Student ID (e.g., STU2024001)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value.toUpperCase())}
          className="h-12 text-center text-lg font-medium tracking-wider"
          disabled={isScanning || scanned}
        />
        
        <Button
          onClick={handleScan}
          disabled={!studentId.trim() || isScanning || scanned}
          variant="hero"
          size="lg"
          className="w-full"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : scanned ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Verified
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Scan ID Card
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
