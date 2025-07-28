import { CalendarDay as CalendarDayType, ViewMode, FinancialData } from "@/types/financial";
import { getVolatilityColor, getPerformanceColor, getPerformanceIcon, getLiquidityLevel } from "@/utils/calendarUtils";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  day: CalendarDayType;
  viewMode: ViewMode;
  onSelect: (date: Date, financialData?: FinancialData) => void;
  onHover: (day: CalendarDayType, position: { x: number; y: number }) => void;
  onHoverEnd: () => void;
}

export function CalendarDay({ day, viewMode, onSelect, onHover, onHoverEnd }: CalendarDayProps) {
  const { date, isToday, isSelected, isWeekend, isOutsideMonth, financialData } = day;

  const handleClick = () => {
    onSelect(date, financialData);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (financialData) {
      const rect = e.currentTarget.getBoundingClientRect();
      onHover(day, {
        x: rect.right + 10,
        y: rect.top,
      });
    }
  };

  const getBackgroundColor = () => {
    if (!financialData) return "";
    
    switch (viewMode) {
      case "volatility":
        return getVolatilityColor(financialData.volatility);
      case "performance":
        if (financialData.performance > 2) return "bg-bull-primary/20";
        if (financialData.performance > 0) return "bg-bull-muted/20";
        if (financialData.performance < -2) return "bg-bear-primary/20";
        if (financialData.performance < 0) return "bg-bear-muted/20";
        return "bg-neutral/20";
      case "liquidity":
        const liquidityLevel = getLiquidityLevel(financialData.liquidity);
        if (liquidityLevel === "high") return "bg-liquidity-high/20";
        if (liquidityLevel === "medium") return "bg-liquidity-medium/20";
        return "bg-liquidity-low/20";
      default:
        return getVolatilityColor(financialData.volatility) + "/50";
    }
  };

  const getTextColor = () => {
    if (isOutsideMonth) return "text-muted-foreground/50";
    if (isToday) return "text-calendar-today";
    if (isSelected) return "text-calendar-selected";
    return "text-foreground";
  };

  const getLiquidityPattern = () => {
    if (!financialData || viewMode === "performance") return null;
    
    const level = getLiquidityLevel(financialData.liquidity);
    if (level === "high") return "bg-gradient-to-br from-liquidity-high/30 to-transparent";
    if (level === "medium") return "bg-gradient-to-br from-liquidity-medium/30 to-transparent";
    return "bg-gradient-to-br from-liquidity-low/30 to-transparent";
  };

  const getVolumeIndicator = () => {
    if (!financialData || viewMode === "volatility") return null;
    
    const volumeHeight = Math.min((financialData.volume / 2000000) * 100, 100);
    return (
      <div 
        className="absolute bottom-0 left-0 w-1 bg-primary/60 rounded-t"
        style={{ height: `${volumeHeight}%` }}
      />
    );
  };

  return (
    <div
      className={cn(
        "relative h-16 sm:h-20 border border-border/50 rounded-md cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-sm group",
        getBackgroundColor(),
        isWeekend && "bg-calendar-weekend/30",
        isToday && "ring-2 ring-calendar-today ring-offset-2 ring-offset-background animate-pulse-glow",
        isSelected && "ring-2 ring-calendar-selected ring-offset-2 ring-offset-background",
        isOutsideMonth && "opacity-40"
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
    >
      {/* Liquidity Pattern Overlay */}
      {getLiquidityPattern() && (
        <div className={cn("absolute inset-0 rounded-md", getLiquidityPattern())} />
      )}
      
      {/* Volume Indicator */}
      {getVolumeIndicator()}
      
      {/* Date Number */}
      <div className={cn("absolute top-1 left-2 text-sm font-medium", getTextColor())}>
        {date.getDate()}
      </div>
      
      {/* Performance Indicator */}
      {financialData && (viewMode === "performance" || viewMode === "all") && (
        <div className={cn(
          "absolute top-1 right-2 text-xs font-bold",
          getPerformanceColor(financialData.performance)
        )}>
          {getPerformanceIcon(financialData.performance)}
        </div>
      )}
      
      {/* Volatility Level */}
      {financialData && (viewMode === "volatility" || viewMode === "all") && (
        <div className="absolute bottom-1 left-2 text-xs text-foreground/70">
          {financialData.volatility.toFixed(1)}%
        </div>
      )}
      
      {/* Price Change */}
      {financialData && (viewMode === "performance" || viewMode === "all") && (
        <div className={cn(
          "absolute bottom-1 right-2 text-xs font-medium",
          getPerformanceColor(financialData.performance)
        )}>
          {financialData.performance >= 0 ? "+" : ""}{financialData.performance.toFixed(1)}%
        </div>
      )}
      
      {/* Liquidity Dots */}
      {financialData && viewMode === "liquidity" && (
        <div className="absolute bottom-1 left-2 flex gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => {
            const level = getLiquidityLevel(financialData.liquidity);
            const isActive = (level === "high" && i < 3) || (level === "medium" && i < 2) || (level === "low" && i < 1);
            return (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full",
                  isActive ? "bg-liquidity-high" : "bg-muted"
                )}
              />
            );
          })}
        </div>
      )}
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-calendar-hover/0 group-hover:bg-calendar-hover/20 rounded-md transition-colors duration-200" />
    </div>
  );
}