import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarView } from "./CalendarView";
import { DataPanel } from "./DataPanel";
import { FilterControls } from "./FilterControls";
import { TimeFrameSelector } from "./TimeFrameSelector";
import { InstrumentSelector } from "./InstrumentSelector";
import { useFinancialData } from "@/hooks/useFinancialData";
import { TimeFrame, ViewMode, FinancialData } from "@/types/financial";

export function FinancialCalendarApp() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("daily");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedInstrument, setSelectedInstrument] = useState("BTC/USD");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data, loading, error } = useFinancialData(timeFrame);

  const handleDateSelect = (date: Date, financialData?: FinancialData) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Financial Calendar</h1>
              <p className="text-muted-foreground">
                Visualize volatility, liquidity, and performance data
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <InstrumentSelector
                value={selectedInstrument}
                onChange={setSelectedInstrument}
              />
              <TimeFrameSelector
                value={timeFrame}
                onChange={setTimeFrame}
              />
              <FilterControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <Card className="p-6">
              <CalendarView
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                financialData={data}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                viewMode={viewMode}
                loading={loading}
                error={error}
              />
            </Card>
          </div>

          {/* Data Panel */}
          <div className="xl:col-span-1">
            <DataPanel
              selectedDate={selectedDate}
              financialData={data}
              timeFrame={timeFrame}
              instrument={selectedInstrument}
            />
          </div>
        </div>
      </main>
    </div>
  );
}