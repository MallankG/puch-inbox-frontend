
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./action-button";
import { Archive, Star, Reply, Forward, Trash2 } from "lucide-react";

interface EmailItemProps {
  subject: string;
  sender: string;
  preview: string;
  time: string;
  isRead: boolean;
  isImportant: boolean;
  category: 'primary' | 'social' | 'promotions' | 'updates';
  onArchive?: () => void;
  onStar?: () => void;
  onReply?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
}

export const EmailItem = ({
  subject,
  sender,
  preview,
  time,
  isRead,
  isImportant,
  category,
  onArchive,
  onStar,
  onReply,
  onForward,
  onDelete
}: EmailItemProps) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'promotions': return 'bg-orange-100 text-orange-800';
      case 'updates': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${!isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-medium ${!isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {subject}
              </h3>
              <Badge className={getCategoryColor()}>
                {category}
              </Badge>
              {isImportant && (
                <Badge variant="destructive">Important</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{sender}</p>
            <p className="text-sm text-gray-500 mb-2">{preview}</p>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          
          <div className="flex items-center space-x-1 ml-4">
            <ActionButton
              icon={Archive}
              label=""
              size="icon"
              variant="ghost"
              onClick={onArchive}
            />
            <ActionButton
              icon={Star}
              label=""
              size="icon"
              variant="ghost"
              onClick={onStar}
            />
            <ActionButton
              icon={Reply}
              label=""
              size="icon"
              variant="ghost"
              onClick={onReply}
            />
            <ActionButton
              icon={Forward}
              label=""
              size="icon"
              variant="ghost"
              onClick={onForward}
            />
            <ActionButton
              icon={Trash2}
              label=""
              size="icon"
              variant="ghost"
              onClick={onDelete}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
