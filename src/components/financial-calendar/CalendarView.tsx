import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDay } from "./CalendarDay";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarTooltip } from "./CalendarTooltip";
import { generateCalendarDays, getCalendarWeeks } from "@/utils/calendarUtils";
import { FinancialData, ViewMode, TooltipData } from "@/types/financial";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  financialData: FinancialData[];
  selectedDate: Date | null;
  onDateSelect: (date: Date, financialData?: FinancialData) => void;
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
}

export function CalendarView({
  currentMonth,
  onMonthChange,
  financialData,
  selectedDate,
  onDateSelect,
  viewMode,
  loading,
  error
}: CalendarViewProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; position: { x: number; y: number } } | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const calendarDays = generateCalendarDays(year, month, financialData, selectedDate);
  const weeks = getCalendarWeeks(calendarDays);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    onMonthChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!selectedDate) return;
    
    let newDate = new Date(selectedDate);
    
    switch (event.key) {
      case "ArrowLeft":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "ArrowRight":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "ArrowUp":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "ArrowDown":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "Escape":
        setHoveredDay(null);
        return;
      default:
        return;
    }
    
    event.preventDefault();
    
    // Update month if needed
    if (newDate.getMonth() !== selectedDate.getMonth()) {
      onMonthChange(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
    
    const dayData = financialData.find(data => data.date === newDate.toISOString().split('T')[0]);
    onDateSelect(newDate, dayData);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedDate, financialData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading financial data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading data: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("prev")}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {monthNames[month]} {year}
          </h2>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("next")}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={goToToday}
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        <CalendarHeader />
        
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <CalendarDay
                  key={`${day.date.getTime()}-${dayIndex}`}
                  day={day}
                  viewMode={viewMode}
                  onSelect={onDateSelect}
                  onHover={(day, position) => {
                    setHoveredDay({ date: day.date, position });
                    if (day.financialData) {
                      setTooltipData({
                        date: day.date.toLocaleDateString(),
                        price: {
                          open: day.financialData.open,
                          high: day.financialData.high,
                          low: day.financialData.low,
                          close: day.financialData.close,
                        },
                        volume: day.financialData.volume,
                        liquidity: day.financialData.liquidity,
                        volatility: day.financialData.volatility,
                        performance: day.financialData.performance,
                        technicalIndicators: {
                          movingAverage: day.financialData.movingAverage,
                          rsi: day.financialData.rsi,
                          vix: day.financialData.vix,
                        },
                      });
                    }
                  }}
                  onHoverEnd={() => {
                    setHoveredDay(null);
                    setTooltipData(null);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && tooltipData && (
        <CalendarTooltip
          data={tooltipData}
          position={hoveredDay.position}
        />
      )}
    </div>
  );
}