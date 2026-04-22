import React from "react";
import {
  TouchableOpacity, Text, View, TextInput, ActivityIndicator,
  type TouchableOpacityProps, type TextInputProps, type ViewProps,
} from "react-native";
import { cn } from "../lib/utils";

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  label: string;
  icon?: React.ReactNode;
  full?: boolean;
}
export function Button({ variant = "primary", size = "md", loading, disabled, label, icon, full, className, ...props }: ButtonProps) {
  const base = "flex-row items-center justify-center gap-2 rounded-2xl active:scale-95";
  const variants = {
    primary:   "bg-[#D32F2F]",
    secondary: "bg-white border border-[#271816]/10",
    ghost:     "bg-transparent",
    danger:    "bg-red-700",
  };
  const sizes = {
    sm: "px-3 py-2",
    md: "px-5 py-3.5",
    lg: "px-6 py-4",
  };
  const textColors = {
    primary:   "text-white",
    secondary: "text-[#271816]",
    ghost:     "text-[#271816]/60",
    danger:    "text-white",
  };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <TouchableOpacity
      className={cn(base, variants[variant], sizes[size], full && "w-full", (disabled || loading) && "opacity-50", className as string)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" || variant === "danger" ? "#fff" : "#D32F2F"} />
      ) : icon}
      <Text className={cn("font-bold tracking-tight", textColors[variant], textSizes[size])}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface MInputProps extends TextInputProps {
  label?: string; error?: string; hint?: string;
}
export function MInput({ label, error, hint, style, ...props }: MInputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-xs font-bold uppercase tracking-widest text-[#271816]/40 mb-2">{label}</Text>
      )}
      <TextInput
        className={cn(
          "w-full bg-white rounded-2xl border px-4 py-3.5 text-sm text-[#271816] font-normal",
          error ? "border-[#D32F2F]" : "border-[#271816]/10",
        )}
        placeholderTextColor="rgba(39,24,22,0.3)"
        {...props}
      />
      {error && <Text className="mt-1.5 text-xs text-[#D32F2F] font-medium">{error}</Text>}
      {hint && !error && <Text className="mt-1.5 text-xs text-[#271816]/35">{hint}</Text>}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function MCard({ children, className, urgent }: { children: React.ReactNode; className?: string; urgent?: boolean }) {
  return (
    <View className={cn(
      "bg-white rounded-2xl p-4",
      urgent ? "border-l-4 border-[#D32F2F] bg-red-50/30" : "border border-[#271816]/6",
      className as string
    )}>
      {children}
    </View>
  );
}

// ─── BloodTypeBadge ───────────────────────────────────────────────────────────
export function MBloodTypeBadge({ type, size = "md" }: { type: string; size?: "sm"|"md"|"lg" }) {
  const sizes = { sm: "w-9 h-7", md: "w-12 h-9", lg: "w-16 h-12" };
  const text  = { sm: "text-xs",  md: "text-sm",  lg: "text-base" };
  return (
    <View className={cn("items-center justify-center rounded-xl bg-red-50 border border-red-100", sizes[size])}>
      <Text className={cn("font-bold text-[#D32F2F]", text[size])}>{type}</Text>
    </View>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "critical"|"urgent"|"standard"|"fulfilled"|"pending";
const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  critical:  { bg: "bg-red-100",    text: "text-red-700"    },
  urgent:    { bg: "bg-amber-100",  text: "text-amber-700"  },
  standard:  { bg: "bg-emerald-100",text: "text-emerald-700"},
  fulfilled: { bg: "bg-sky-100",    text: "text-sky-700"    },
  pending:   { bg: "bg-[#271816]/6",text: "text-[#271816]/50"},
};
export function MBadge({ label, variant = "pending" }: { label: string; variant?: BadgeVariant }) {
  const s = BADGE_STYLES[variant];
  return (
    <View className={cn("flex-row items-center px-2.5 py-1 rounded-full", s.bg)}>
      <Text className={cn("text-xs font-bold", s.text)}>{label}</Text>
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function MStatCard({ label, value, sub }: { label: string; value: string|number; sub?: string }) {
  return (
    <MCard className="flex-1">
      <Text className="text-xs font-bold uppercase tracking-widest text-[#271816]/35 mb-1">{label}</Text>
      <Text className="text-2xl font-bold text-[#271816]">{String(value)}</Text>
      {sub && <Text className="text-xs text-[#271816]/40 mt-0.5">{sub}</Text>}
    </MCard>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View className="flex-row items-center justify-between mb-3 px-4">
      <Text className="font-bold text-base text-[#271816]">{title}</Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text className="text-sm font-semibold text-[#D32F2F]">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function MEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View className="items-center py-14 px-8">
      <Text className="font-bold text-base text-[#271816]/50 text-center">{title}</Text>
      {description && <Text className="text-sm text-[#271816]/30 text-center mt-1">{description}</Text>}
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function MDivider() {
  return <View className="h-px bg-[#271816]/6 my-1" />;
}