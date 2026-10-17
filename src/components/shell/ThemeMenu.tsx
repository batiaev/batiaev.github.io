import React from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type ThemeChoice } from "@/lib/theme";

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const ThemeMenu = () => {
  const [theme, setTheme] = useTheme();
  const Current = OPTIONS.find((o) => o.value === theme)?.Icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Theme"
        title="Theme"
        className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.045] data-[state=open]:bg-foreground/[0.06] data-[state=open]:text-foreground grid size-8 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Current className="size-4" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-40">
        <DropdownMenuLabel className="eyebrow px-2 py-1.5">Theme</DropdownMenuLabel>
        {OPTIONS.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            className="gap-2 text-[13px]"
          >
            <Icon className="size-4 opacity-70" aria-hidden />
            {label}
            {theme === value ? (
              <Check className="ml-auto size-3.5 opacity-70" aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeMenu;
