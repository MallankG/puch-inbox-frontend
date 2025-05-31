
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  defaultValue: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const FilterTabs = ({ tabs, defaultValue, onValueChange, className }: FilterTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={className}>
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
