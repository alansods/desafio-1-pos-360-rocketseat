import { ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 150);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 -top-6 right-0 z-50 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg space-y-4"
        style={{
          animation: isOpen
            ? "scaleIn 0.15s ease-out"
            : "scaleOut 0.15s ease-in",
        }}
      >
        <div className="space-y-2 mb-8">
          <h3 className="text-lg font-bold mb-4">{title}</h3>
          {description && (
            <p className=" text-gray-500 text-md">{description}</p>
          )}
        </div>

        {children}

        <div className="flex justify-end gap-2">
          {footer ? (
            footer
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
