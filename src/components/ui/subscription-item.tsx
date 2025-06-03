import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./action-button";
import { X, Archive, Plus } from "lucide-react";

interface SubscriptionItemProps {
  name: string;
  email: string;
  category: 'free' | 'paid' | 'promotional';
  frequency: string;
  lastReceived: string;
  cost?: string;
  status: string; // allow any string for status
  archived?: boolean;
  onUnsubscribe?: () => void;
  onSubscribe?: () => void;
  onArchive?: () => void;
  onUnmarkImportant?: () => void;
  onUnarchive?: () => void;
}

export const SubscriptionItem = ({
  name,
  email,
  category,
  frequency,
  lastReceived,
  cost,
  status,
  archived = false,
  onUnsubscribe,
  onSubscribe,
  onArchive,
  onUnmarkImportant,
  onUnarchive
}: SubscriptionItemProps) => {
  const getCategoryColor = () => {
    // Use a bold blue gradient similar to the Google login button
    return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-sm';
  };

  const getStatusColor = () => {
    switch (status) {
      case 'unsubscribed': return 'bg-red-600 text-white font-semibold';
      case 'processing': return 'bg-yellow-400 text-gray-900 font-semibold';
      default: return 'bg-green-600 text-white font-semibold'; // active
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-medium text-gray-900">{name}</h3>
              <Badge className={getCategoryColor()}>
                {category}
              </Badge>
              <Badge className={getStatusColor()}>
                {status}
              </Badge>
              {archived && (
                <Badge className="bg-gray-400 text-white font-semibold">Archived</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{email}</p>
          </div>
          <div className="flex items-center space-x-2">
            {archived ? (
              <ActionButton
                icon={Archive}
                label="Unarchive"
                onClick={onUnarchive}
                className="min-w-[120px] px-4 bg-blue-500 text-white hover:bg-blue-600 border-blue-700"
              />
            ) : (
              <>
                {status === 'unsubscribed' ? (
                  <ActionButton
                    icon={Plus}
                    label={'Subscribe'}
                    variant="default"
                    className="min-w-[148px] px-4 bg-green-600 text-white hover:bg-green-700 border-green-700"
                    onClick={onSubscribe}
                  />
                ) : (
                  <ActionButton
                    icon={X}
                    label="Unsubscribe"
                    variant="destructive"
                    className="min-w-[148px] px-4 bg-red-600 text-white hover:bg-red-700 border-red-700"
                    onClick={onUnsubscribe}
                  />
                )}
                <ActionButton
                  icon={Archive}
                  label="Archive"
                  onClick={onArchive}
                  className="min-w-[120px] px-4 bg-gray-500 text-white hover:bg-gray-600 border-gray-700"
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
