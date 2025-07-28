import { useState, useEffect, useMemo } from "react";
import { FinancialData, TimeFrame } from "@/types/financial";

// Generate mock financial data
function generateMockData(startDate: Date, endDate: Date): FinancialData[] {
  const data: FinancialData[] = [];
  const currentDate = new Date(startDate);
  let lastClose = 50000; // Starting price

  while (currentDate <= endDate) {
    // Skip weekends for daily data
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const volatility = Math.random() * 0.1 + 0.02; // 2-12% volatility
      const priceChange = (Math.random() - 0.5) * volatility * lastClose;
      
      const open = lastClose;
      const close = open + priceChange;
      const high = Math.max(open, close) + Math.random() * 0.02 * lastClose;
      const low = Math.min(open, close) - Math.random() * 0.02 * lastClose;
      
      const volume = Math.random() * 1000000 + 500000;
      const liquidity = Math.random() * 100 + 50;
      const performance = ((close - open) / open) * 100;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume,
        liquidity,
        volatility: volatility * 100,
        performance,
        movingAverage: lastClose * (0.95 + Math.random() * 0.1),
        rsi: Math.random() * 100,
        vix: Math.random() * 50 + 10,
      });
      
      lastClose = close;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

export function useFinancialData(timeFrame: TimeFrame = "daily") {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate data for the last 3 months
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return { start, end };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = generateMockData(dateRange.start, dateRange.end);
        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, timeFrame]);

  // Aggregate data based on timeframe
  const aggregatedData = useMemo(() => {
    if (timeFrame === "daily") return data;
    
    // For weekly/monthly aggregation
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.date);
      let key: string;
      
      if (timeFrame === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, FinancialData[]>);

    return Object.entries(grouped).map(([key, items]) => {
      const first = items[0];
      const last = items[items.length - 1];
      const high = Math.max(...items.map(item => item.high));
      const low = Math.min(...items.map(item => item.low));
      const volume = items.reduce((sum, item) => sum + item.volume, 0);
      const avgVolatility = items.reduce((sum, item) => sum + item.volatility, 0) / items.length;
      const avgLiquidity = items.reduce((sum, item) => sum + item.liquidity, 0) / items.length;
      
      return {
        date: key,
        open: first.open,
        high,
        low,
        close: last.close,
        volume,
        liquidity: avgLiquidity,
        volatility: avgVolatility,
        performance: ((last.close - first.open) / first.open) * 100,
        movingAverage: items.reduce((sum, item) => sum + item.movingAverage, 0) / items.length,
        rsi: items.reduce((sum, item) => sum + item.rsi, 0) / items.length,
        vix: items.reduce((sum, item) => sum + item.vix, 0) / items.length,
      };
    });
  }, [data, timeFrame]);

  return {
    data: aggregatedData,
    loading,
    error,
    refetch: () => {
      const mockData = generateMockData(dateRange.start, dateRange.end);
      setData(mockData);
    }
  };
}