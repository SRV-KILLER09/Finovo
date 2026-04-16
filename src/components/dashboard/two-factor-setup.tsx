
"use client";

import { useEffect, useState, useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { setup2faAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  success: false,
};

export function TwoFactorSetup({ isNewUser }: { isNewUser: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(setup2faAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (isNewUser) {
      setOpen(true);
    }
  }, [isNewUser]);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast({
        title: "Success!",
        description: "Your 2-Factor Authentication has been set up.",
      });
    }
  }, [state.success, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Set up 2-Factor Authentication</DialogTitle>
            <DialogDescription>
              For added security, please set up a 6-digit PIN. This will be
              your permanent 2FA PIN until you change it in settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="2fa">6-Digit 2FA PIN</Label>
              <Input
                id="2fa"
                name="2fa"
                type="text"
                pattern="\\d{6}"
                maxLength={6}
                placeholder="123456"
                required
                title="Please enter a 6-digit number."
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton>Save PIN</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
