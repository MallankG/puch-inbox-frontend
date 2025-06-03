import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./action-button";
import { X, Archive, Star, MoreHorizontal } from "lucide-react";

interface SubscriptionItemProps {
  name: string;
  email: string;
  category: 'free' | 'paid' | 'promotional';
  frequency: string;
  lastReceived: string;
  cost?: string;
  status: 'active' | 'unsubscribed' | 'processing';
  onUnsubscribe?: () => void;
  onArchive?: () => void;
  onMarkImportant?: () => void;
}

export const SubscriptionItem = ({
  name,
  email,
  category,
  frequency,
  lastReceived,
  cost,
  status,
  onUnsubscribe,
  onArchive,
  onMarkImportant
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
            </div>
            <p className="text-sm text-gray-600 mb-1">{email}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <ActionButton
              icon={X}
              label="Unsubscribe"
              variant="destructive"
              onClick={onUnsubscribe}
              disabled={status === 'unsubscribed'}
            />
            <ActionButton
              icon={Archive}
              label="Archive"
              onClick={onArchive}
            />
            <ActionButton
              icon={Star}
              label="Important"
              onClick={onMarkImportant}
            />  
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
