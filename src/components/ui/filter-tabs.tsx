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
  const gridStyle = { gridTemplateColumns: `repeat(${tabs.length}, 1fr)` };

   return (
     <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={className}>
      <TabsList className="w-full justify-center items-center grid" style={gridStyle}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center justify-center space-x-2 text-muted-foreground data-[state=active]:text-foreground">
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
