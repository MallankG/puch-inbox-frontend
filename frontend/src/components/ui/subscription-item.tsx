
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./action-button";
import { Unsubscribe, Archive, Star, MoreHorizontal } from "lucide-react";

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
    switch (category) {
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'promotional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'unsubscribed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
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
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Frequency: {frequency}</span>
              <span>Last: {lastReceived}</span>
              {cost && <span>Cost: {cost}</span>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ActionButton
              icon={Unsubscribe}
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
            <ActionButton
              icon={MoreHorizontal}
              label=""
              size="icon"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
