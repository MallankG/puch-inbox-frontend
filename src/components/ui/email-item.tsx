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
      case 'primary': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'social': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'promotions': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'updates': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow bg-card text-card-foreground ${!isRead ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Badge className={getCategoryColor()}>{category}</Badge>
              {isImportant && <span className="text-xs text-yellow-500 font-semibold">★</span>}
            </div>
            <h4 className="font-medium text-foreground mb-1">{subject}</h4>
            <p className="text-sm text-muted-foreground mb-1">{preview}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{sender}</span>
              <span>•</span>
              <span>{time}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <ActionButton icon={Archive} label="Archive" onClick={onArchive} />
            <ActionButton icon={Star} label="Star" onClick={onStar} />
            <ActionButton icon={Reply} label="Reply" onClick={onReply} />
            <ActionButton icon={Forward} label="Forward" onClick={onForward} />
            <ActionButton icon={Trash2} label="Delete" onClick={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
