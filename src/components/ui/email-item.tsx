import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "./action-button";
import { Archive, Star, Reply, Forward, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import * as React from 'react';
import { Star as StarIcon } from 'lucide-react';

interface EmailItemProps {
  subject: string;
  sender: string; // sender name or fallback
  senderEmail?: string; // sender email address
  preview: string;
  time: string;
  isRead: boolean;
  isImportant: boolean;
  category: 'primary' | 'social' | 'promotions' | 'updates';
  attachments?: { filename: string }[];
  onArchive?: () => void;
  onStar?: () => void;
  onUnstar?: () => void;
  onReply?: () => void;
  onForward?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  isArchived?: boolean;
  archivedBadge?: boolean;
}

// Custom filled star icon for yellow star
const FilledStarIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof StarIcon>>((props, ref) => (
  <StarIcon ref={ref} {...props} fill="#facc15" color="#facc15" />
))

export const EmailItem = ({
  subject,
  sender,
  senderEmail,
  preview,
  time,
  isRead,
  isImportant,
  category,
  attachments,
  isArchived = false,
  archivedBadge = false,
  onArchive,
  onUnarchive,
  onStar,
  onUnstar,
  onReply,
  onForward,
  onDelete,
  onView
}: EmailItemProps & { isArchived?: boolean; onUnarchive?: () => void; archivedBadge?: boolean }) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'primary': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'social': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'promotions': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'updates': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Format time like Gmail (e.g., '2:30 PM' or 'Mon' or 'Mar 5')
  let displayTime = '';
  if (time) {
    try {
      const dateObj = typeof time === 'string' && time.length > 10 ? parseISO(time) : new Date(time);
      const now = new Date();
      if (
        dateObj.getFullYear() === now.getFullYear() &&
        dateObj.getMonth() === now.getMonth() &&
        dateObj.getDate() === now.getDate()
      ) {
        // Today: show time
        displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (dateObj.getFullYear() === now.getFullYear()) {
        // This year: show short month + day
        displayTime = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        // Else: show short month + year
        displayTime = dateObj.toLocaleDateString([], { month: 'short', year: '2-digit' });
      }
    } catch {
      displayTime = time;
    }
  }

  return (
    <Card
      className={`w-full mx-auto hover:shadow-md transition-shadow 
        ${isRead 
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' 
          : 'bg-white dark:bg-blue-900/40 text-black dark:text-white border-blue-200 dark:border-blue-700 font-semibold'}
      `}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Badge className={getCategoryColor()}>{category}</Badge>
              {archivedBadge && <Badge className="bg-gray-400 text-white">Archived</Badge>}
              {isImportant && <span className="text-sm text-yellow-500 font-semibold">★</span>}
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-base truncate">
                {subject}
              </h4>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-200 whitespace-nowrap ml-4 mr-2">{displayTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm mb-1">
              <span className="font-semibold truncate">{sender}</span>
              {senderEmail && <span className="text-sm text-muted-foreground truncate">({senderEmail})</span>}
              {/* Action buttons horizontally aligned with sender details */}
              <div className="flex flex-row items-center gap-1 ml-4">
                {isArchived ? (
                  <ActionButton icon={Archive} label="Unarchive" onClick={onUnarchive} />
                ) : (
                  <ActionButton icon={Archive} label="Archive" onClick={onArchive} />
                )}
                {isImportant ? (
                  <ActionButton icon={FilledStarIcon} label="Unstar" onClick={onUnstar} />
                ) : (
                  <ActionButton icon={Star} label="Star" onClick={onStar} />
                )}
                <ActionButton icon={Reply} label="Reply" onClick={onReply} />
                <ActionButton icon={Forward} label="Forward" onClick={onForward} />
                <ActionButton icon={Trash2} label="Delete" onClick={onDelete} />
                <ActionButton icon={Eye} label="View" onClick={onView} />
              </div>
            </div>
            {attachments && attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {attachments.map((att, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    📎 {att.filename}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
