export interface FinancialData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  liquidity: number;
  volatility: number;
  performance: number;
  movingAverage: number;
  rsi: number;
  vix: number;
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isOutsideMonth: boolean;
  financialData?: FinancialData;
}

export type TimeFrame = "daily" | "weekly" | "monthly";
export type ViewMode = "volatility" | "liquidity" | "performance" | "all";
export type VolatilityLevel = "low" | "medium" | "high" | "extreme";
export type LiquidityLevel = "low" | "medium" | "high";

export interface FilterOptions {
  instrument: string;
  timeFrame: TimeFrame;
  viewMode: ViewMode;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface TooltipData {
  date: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  volume: number;
  liquidity: number;
  volatility: number;
  performance: number;
  technicalIndicators: {
    movingAverage: number;
    rsi: number;
    vix: number;
  };
}