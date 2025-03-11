import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";

interface PinDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPinSubmit?: (pin: string) => void;
  isSetup?: boolean;
  title?: string;
  description?: string;
}

const PinDialog = ({
  isOpen = true,
  onClose = () => {},
  onPinSubmit = () => {},
  isSetup = false,
  title = isSetup ? "Create a PIN" : "Enter PIN",
  description = isSetup
    ? "Create a 6-digit PIN to secure your configuration panel"
    : "Enter your 6-digit PIN to access the configuration panel",
}: PinDialogProps) => {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [inputRefs, setInputRefs] = useState<
    React.RefObject<HTMLInputElement>[]
  >([]);

  // Initialize refs for each input field
  useEffect(() => {
    setInputRefs(
      Array(6)
        .fill(0)
        .map(() => React.createRef<HTMLInputElement>()),
    );
  }, []);

  const handlePinChange = (
    index: number,
    value: string,
    isPinConfirm: boolean = false,
  ) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newPin = isPinConfirm ? [...confirmPin] : [...pin];

    // Handle paste event (multiple digits)
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6 - index);
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newPin[index + i] = digit;
        }
      });

      // Focus on the next input after pasted digits
      const nextIndex = Math.min(index + digits.length, 5);
      if (nextIndex < 5) {
        setTimeout(() => {
          inputRefs[nextIndex + 1]?.current?.focus();
        }, 0);
      }
    } else {
      // Handle single digit input
      newPin[index] = value;

      // Auto-focus next input
      if (value && index < 5) {
        setTimeout(() => {
          inputRefs[index + 1]?.current?.focus();
        }, 0);
      }
    }

    if (isPinConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    setError("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isPinConfirm: boolean = false,
  ) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace") {
      const currentPin = isPinConfirm ? confirmPin : pin;
      if (!currentPin[index] && index > 0) {
        setTimeout(() => {
          inputRefs[index - 1]?.current?.focus();
        }, 0);
      }
    }
  };

  const handleSubmit = () => {
    const pinString = pin.join("");

    // Validate PIN length
    if (pinString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    // For PIN setup, validate confirmation
    if (isSetup) {
      const confirmPinString = confirmPin.join("");
      if (confirmPinString.length !== 6) {
        setError("Please confirm all 6 digits");
        return;
      }

      if (pinString !== confirmPinString) {
        setError("PINs do not match");
        return;
      }
    }

    onPinSubmit(pinString);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {isSetup ? "Create PIN" : "Enter PIN"}
              </label>
              <div className="flex justify-between gap-2">
                {pin.map((digit, index) => (
                  <Input
                    key={`pin-${index}`}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {isSetup && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Confirm PIN
                </label>
                <div className="flex justify-between gap-2">
                  {confirmPin.map((digit, index) => (
                    <Input
                      key={`confirm-pin-${index}`}
                      ref={inputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) =>
                        handlePinChange(index, e.target.value, true)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e, true)}
                      className="w-12 h-12 text-center text-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {error && <div className="text-destructive text-sm">{error}</div>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isSetup ? "Create PIN" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
