import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewMode } from "@/types/financial";
import { Activity, TrendingUp, Droplets, Grid3X3 } from "lucide-react";

interface FilterControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function FilterControls({ viewMode, onViewModeChange }: FilterControlsProps) {
  const viewModes: Array<{ mode: ViewMode; label: string; icon: React.ReactNode; description: string }> = [
    {
      mode: "all",
      label: "All",
      icon: <Grid3X3 className="h-4 w-4" />,
      description: "Show all data layers"
    },
    {
      mode: "volatility",
      label: "Volatility",
      icon: <Activity className="h-4 w-4" />,
      description: "Focus on volatility heatmap"
    },
    {
      mode: "performance",
      label: "Performance",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Show performance indicators"
    },
    {
      mode: "liquidity",
      label: "Liquidity",
      icon: <Droplets className="h-4 w-4" />,
      description: "Display liquidity metrics"
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">View:</span>
      <div className="flex items-center gap-1">
        {viewModes.map(({ mode, label, icon }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange(mode)}
            className="flex items-center gap-2"
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}