export function CalendarHeader() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {dayNames.map((day) => (
        <div
          key={day}
          className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
    </div>
  );
}