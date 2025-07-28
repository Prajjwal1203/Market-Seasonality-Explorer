import { Card } from "@/components/ui/card";
import { TooltipData } from "@/types/financial";
import { formatCurrency, formatPercentage, formatVolume } from "@/utils/calendarUtils";

interface CalendarTooltipProps {
  data: TooltipData;
  position: { x: number; y: number };
}

export function CalendarTooltip({ data, position }: CalendarTooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Card className="p-4 min-w-[280px] shadow-card border-border/50 bg-card/95 backdrop-blur-sm">
        <div className="space-y-3">
          {/* Header */}
          <div className="border-b border-border/30 pb-2">
            <h3 className="font-semibold text-foreground">{data.date}</h3>
          </div>
          
          {/* Price Data */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Price Action</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open:</span>
                <span className="font-medium">{formatCurrency(data.price.open)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High:</span>
                <span className="font-medium text-bull-muted">{formatCurrency(data.price.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Low:</span>
                <span className="font-medium text-bear-muted">{formatCurrency(data.price.low)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Close:</span>
                <span className="font-medium">{formatCurrency(data.price.close)}</span>
              </div>
            </div>
          </div>
          
          {/* Volume & Liquidity */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Volume & Liquidity</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-medium">{formatVolume(data.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liquidity:</span>
                <span className="font-medium">{data.liquidity.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Performance */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Performance</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Change:</span>
                <span className={`font-medium ${
                  data.performance >= 0 ? "text-bull-primary" : "text-bear-primary"
                }`}>
                  {formatPercentage(data.performance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volatility:</span>
                <span className="font-medium">{data.volatility.toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          {/* Technical Indicators */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Technical Indicators</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">MA(20):</span>
                <span className="font-medium">{formatCurrency(data.technicalIndicators.movingAverage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RSI:</span>
                <span className="font-medium">{data.technicalIndicators.rsi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VIX:</span>
                <span className="font-medium">{data.technicalIndicators.vix.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}