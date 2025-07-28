import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { FinancialData, TimeFrame } from "@/types/financial";
import { formatCurrency, formatPercentage, formatVolume, getVolatilityLevel, getLiquidityLevel } from "@/utils/calendarUtils";

interface DataPanelProps {
  selectedDate: Date | null;
  financialData: FinancialData[];
  timeFrame: TimeFrame;
  instrument: string;
}

export function DataPanel({ selectedDate, financialData, timeFrame, instrument }: DataPanelProps) {
  const selectedData = selectedDate 
    ? financialData.find(data => data.date === selectedDate.toISOString().split('T')[0])
    : null;

  const getStatistics = () => {
    if (financialData.length === 0) return null;
    
    const prices = financialData.map(d => d.close);
    const volatilities = financialData.map(d => d.volatility);
    const volumes = financialData.map(d => d.volume);
    
    return {
      avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgVolatility: volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length,
      maxVolatility: Math.max(...volatilities),
      totalVolume: volumes.reduce((sum, v) => sum + v, 0),
    };
  };

  const stats = getStatistics();

  const exportData = () => {
    if (!selectedData && !stats) return;
    
    const data = selectedData || stats;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${selectedDate?.toISOString().split('T')[0] || 'summary'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!selectedDate && !stats) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a date to view detailed analytics</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{instrument}</h3>
            <p className="text-sm text-muted-foreground capitalize">{timeFrame} View</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        {selectedDate && (
          <div className="text-sm text-muted-foreground">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        )}
      </Card>

      {/* Selected Date Details */}
      {selectedData && (
        <Card className="p-4">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Daily Metrics
          </h4>
          
          <div className="space-y-4">
            {/* Price Action */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Price Action</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Open:</span>
                  <div className="font-medium">{formatCurrency(selectedData.open)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Close:</span>
                  <div className="font-medium">{formatCurrency(selectedData.close)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">High:</span>
                  <div className="font-medium text-bull-muted">{formatCurrency(selectedData.high)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Low:</span>
                  <div className="font-medium text-bear-muted">{formatCurrency(selectedData.low)}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Performance</h5>
              <div className="flex items-center gap-2 mb-2">
                {selectedData.performance >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-bull-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-bear-primary" />
                )}
                <span className={`font-medium ${
                  selectedData.performance >= 0 ? "text-bull-primary" : "text-bear-primary"
                }`}>
                  {formatPercentage(selectedData.performance)}
                </span>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volatility:</span>
                  <Badge variant={getVolatilityLevel(selectedData.volatility) === "high" ? "destructive" : "secondary"}>
                    {selectedData.volatility.toFixed(2)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume:</span>
                  <span className="font-medium">{formatVolume(selectedData.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liquidity:</span>
                  <Badge variant={getLiquidityLevel(selectedData.liquidity) === "high" ? "default" : "secondary"}>
                    {selectedData.liquidity.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Technical Indicators */}
            <div>
              <h5 className="text-sm font-medium text-muted-foreground mb-2">Technical Indicators</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MA(20):</span>
                  <span className="font-medium">{formatCurrency(selectedData.movingAverage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RSI:</span>
                  <span className="font-medium">{selectedData.rsi.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VIX:</span>
                  <span className="font-medium">{selectedData.vix.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Statistics */}
      {stats && (
        <Card className="p-4">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Period Summary
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Price:</span>
              <span className="font-medium">{formatCurrency(stats.avgPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Range:</span>
              <span className="font-medium">
                {formatCurrency(stats.minPrice)} - {formatCurrency(stats.maxPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Volatility:</span>
              <span className="font-medium">{stats.avgVolatility.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Volatility:</span>
              <span className="font-medium text-volatility-high">{stats.maxVolatility.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Volume:</span>
              <span className="font-medium">{formatVolume(stats.totalVolume)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trend Analysis
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Compare Periods
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </Card>
    </div>
  );
}