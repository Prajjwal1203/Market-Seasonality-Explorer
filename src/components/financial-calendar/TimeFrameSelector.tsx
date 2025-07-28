import { Button } from "@/components/ui/button";
import { TimeFrame } from "@/types/financial";
import { Calendar, Clock, CalendarDays } from "lucide-react";

interface TimeFrameSelectorProps {
  value: TimeFrame;
  onChange: (timeFrame: TimeFrame) => void;
}

export function TimeFrameSelector({ value, onChange }: TimeFrameSelectorProps) {
  const timeFrames: Array<{ value: TimeFrame; label: string; icon: React.ReactNode }> = [
    {
      value: "daily",
      label: "Daily",
      icon: <Clock className="h-4 w-4" />
    },
    {
      value: "weekly",
      label: "Weekly",
      icon: <CalendarDays className="h-4 w-4" />
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Timeframe:</span>
      <div className="flex items-center border border-border rounded-md p-1">
        {timeFrames.map(({ value: timeFrame, label, icon }) => (
          <Button
            key={timeFrame}
            variant={value === timeFrame ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(timeFrame)}
            className="flex items-center gap-2 h-8"
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}