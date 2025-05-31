
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionButton = ({ 
  icon: Icon, 
  label, 
  variant = 'outline',
  size = 'sm',
  onClick,
  disabled,
  className 
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <Icon className="h-4 w-4 mr-1" />
      {label}
    </Button>
  );
};
