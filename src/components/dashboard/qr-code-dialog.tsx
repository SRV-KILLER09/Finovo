
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface QrCodeDialogProps {
  children: React.ReactNode;
  email: string;
}

export function QrCodeDialog({ children, email }: QrCodeDialogProps) {
  const username = email.split('@')[0];
  const qrData = `upi://pay?pa=${username}@finovo`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>My QR Code</DialogTitle>
          <DialogDescription>
            Share this QR code to receive payments directly to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <Image 
              src={qrUrl}
              width={250}
              height={250}
              alt="Your UPI QR Code"
              className="rounded-lg border p-2 bg-white"
              data-ai-hint="qr code"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    
