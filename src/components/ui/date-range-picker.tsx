import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IDateRangePickerProps } from "@/constants/interfaces";

export function DateRangePicker({
  className,
  date,
  onDateChange,
  isDarkMode,
}: IDateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal hover:cursor-pointer",
              !date && "text-muted-foreground",
              isDarkMode &&
                "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={{ after: today }}
            className={cn(
              isDarkMode ? "bg-gray-800 text-white" : "",
              "[&_button.rdp-button]:hover:cursor-pointer",
              "[&_button.rdp-day]:hover:bg-gray-100 [&_button.rdp-day]:transition-colors",
              isDarkMode && "[&_button.rdp-day]:hover:bg-gray-700",
            )}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
