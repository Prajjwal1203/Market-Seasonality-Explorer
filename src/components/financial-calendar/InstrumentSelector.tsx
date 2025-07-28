import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, TrendingUp } from "lucide-react";

interface InstrumentSelectorProps {
  value: string;
  onChange: (instrument: string) => void;
}

export function InstrumentSelector({ value, onChange }: InstrumentSelectorProps) {
  const instruments = [
    { symbol: "BTC/USD", name: "Bitcoin", category: "Crypto" },
    { symbol: "ETH/USD", name: "Ethereum", category: "Crypto" },
    { symbol: "AAPL", name: "Apple Inc.", category: "Stock" },
    { symbol: "TSLA", name: "Tesla Inc.", category: "Stock" },
    { symbol: "SPY", name: "S&P 500 ETF", category: "ETF" },
    { symbol: "EUR/USD", name: "Euro/Dollar", category: "Forex" },
    { symbol: "GBP/USD", name: "Pound/Dollar", category: "Forex" },
    { symbol: "GOLD", name: "Gold Futures", category: "Commodities" },
  ];

  const categories = instruments.reduce((acc, instrument) => {
    if (!acc[instrument.category]) {
      acc[instrument.category] = [];
    }
    acc[instrument.category].push(instrument);
    return acc;
  }, {} as Record<string, typeof instruments>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[140px] justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>{value}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {Object.entries(categories).map(([category, categoryInstruments]) => (
          <div key={category}>
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              {category}
            </div>
            {categoryInstruments.map((instrument) => (
              <DropdownMenuItem
                key={instrument.symbol}
                onClick={() => onChange(instrument.symbol)}
                className="flex flex-col items-start px-3 py-2"
              >
                <div className="font-medium">{instrument.symbol}</div>
                <div className="text-sm text-muted-foreground">{instrument.name}</div>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}