import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface UnsubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionName: string;
  subscriptionEmail: string;
  unsubscribeUrl?: string;
  method: 'body-link' | 'url' | 'mailto';
  requiresManualAction?: boolean;
  message?: string;
}

export const UnsubscribeModal = ({
  isOpen,
  onClose,
  subscriptionName,
  subscriptionEmail,
  unsubscribeUrl,
  method,
  requiresManualAction,
  message
}: UnsubscribeModalProps) => {
  const [userConfirmed, setUserConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleOpenLink = () => {
    if (unsubscribeUrl) {
      window.open(unsubscribeUrl, '_blank');
    }
  };

  const handleConfirmCompletion = () => {
    setUserConfirmed(true);
    setTimeout(() => {
      onClose();
      setUserConfirmed(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {userConfirmed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : requiresManualAction ? (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-blue-500" />
            )}
            Unsubscribe from {subscriptionName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userConfirmed ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">
                Thank you for confirming! The unsubscription has been marked as completed.
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600">
                <p><strong>Email:</strong> {subscriptionEmail}</p>
                <p><strong>Method:</strong> {method}</p>
              </div>
              
              {message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">{message}</p>
                </div>
              )}

              {requiresManualAction && unsubscribeUrl && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 mb-3">
                    This unsubscription requires manual action. Please click the button below to visit the unsubscribe page and follow the instructions.
                  </p>
                  <Button 
                    onClick={handleOpenLink}
                    className="w-full"
                    variant="outline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Unsubscribe Page
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                {requiresManualAction && (
                  <Button onClick={handleConfirmCompletion} className="flex-1">
                    I've Completed Unsubscription
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
