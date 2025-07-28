import { FinancialData, CalendarDay, VolatilityLevel, LiquidityLevel } from "@/types/financial";

export function getVolatilityLevel(volatility: number): VolatilityLevel {
  if (volatility < 2) return "low";
  if (volatility < 5) return "medium";
  if (volatility < 10) return "high";
  return "extreme";
}

export function getLiquidityLevel(liquidity: number): LiquidityLevel {
  if (liquidity < 40) return "low";
  if (liquidity < 80) return "medium";
  return "high";
}

export function getVolatilityColor(volatility: number): string {
  const level = getVolatilityLevel(volatility);
  switch (level) {
    case "low": return "bg-volatility-low";
    case "medium": return "bg-volatility-medium";
    case "high": return "bg-volatility-high";
    case "extreme": return "bg-volatility-extreme";
  }
}

export function getPerformanceColor(performance: number): string {
  if (performance > 2) return "text-bull-primary";
  if (performance > 0) return "text-bull-muted";
  if (performance < -2) return "text-bear-primary";
  if (performance < 0) return "text-bear-muted";
  return "text-neutral";
}

export function getPerformanceIcon(performance: number): string {
  if (performance > 0.5) return "↗";
  if (performance < -0.5) return "↘";
  return "→";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value > 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value > 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value > 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}

export function generateCalendarDays(
  year: number,
  month: number,
  financialData: FinancialData[],
  selectedDate?: Date
): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  
  // Add previous month's trailing days
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  // Add next month's leading days
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
  
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayData = financialData.find(data => data.date === dateStr);
    
    days.push({
      date: new Date(current),
      isToday: current.toDateString() === today.toDateString(),
      isSelected: selectedDate ? current.toDateString() === selectedDate.toDateString() : false,
      isWeekend: current.getDay() === 0 || current.getDay() === 6,
      isOutsideMonth: current.getMonth() !== month,
      financialData: dayData,
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

export function getCalendarWeeks(days: CalendarDay[]): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}