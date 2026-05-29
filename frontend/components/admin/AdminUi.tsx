import { Text, TextInput, TouchableOpacity, View } from "react-native";

export function SectionTitle({
  title,
  subtitle,
  darkText,
  lightPanel,
}: {
  title: string;
  subtitle?: string;
  darkText?: boolean;
  lightPanel?: boolean;
}) {
  return (
    <View>
      <View className="self-start">
        <Text
          className={`font-gothamBold text-xl ${
            darkText || lightPanel ? "text-black" : "text-white"
          }`}
        >
          {title}
        </Text>
        <View className="mt-2 h-1.5 w-16 rounded-full bg-red-600" />
      </View>
      {subtitle ? (
        <Text
          className={`mt-3 font-gothamLight text-sm leading-5 ${
            darkText || lightPanel ? "text-black" : "text-white"
          }`}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  multiline,
  darkLabel,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
  darkLabel?: boolean;
}) {
  return (
    <View>
      <Text
        className={`mb-2 font-gothamMedium text-sm ${
          darkLabel ? "text-black" : "text-white"
        }`}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor="#737373"
        className={`rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 ${
          multiline ? "min-h-[96px]" : ""
        }`}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-2xl px-4 py-3 shadow ${disabled ? "bg-red-400" : "bg-red-600"}`}
    >
      <Text className="text-center font-gothamMedium text-white">{label}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl border border-red-200 bg-white px-4 py-3"
    >
      <Text className="text-center font-gothamMedium text-red-700">{label}</Text>
    </TouchableOpacity>
  );
}

export function RecordCard({
  title,
  subtitle,
  tone,
  actionLabel,
  onPressAction,
  secondaryActionLabel,
  onPressSecondaryAction,
}: {
  title: string;
  subtitle: string;
  tone?: "default" | "highlight";
  actionLabel?: string;
  onPressAction?: () => void;
  secondaryActionLabel?: string;
  onPressSecondaryAction?: () => void;
}) {
  const effectiveTone =
    tone ?? (actionLabel && secondaryActionLabel ? "highlight" : "default");

  return (
    <View
      className={`rounded-2xl border p-4 ${
        effectiveTone === "highlight"
          ? "border-red-500 bg-red-600"
          : "border-neutral-200 bg-white"
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text
            className={`font-gothamBold text-base ${
              effectiveTone === "highlight" ? "text-white" : "text-neutral-900"
            }`}
          >
            {title}
          </Text>
          <Text
            className={`mt-1 font-gothamLight text-sm ${
              effectiveTone === "highlight" ? "text-red-100" : "text-neutral-500"
            }`}
          >
            {subtitle}
          </Text>
        </View>

        <View className="flex-row gap-2">
          {actionLabel && onPressAction ? (
            <TouchableOpacity
              onPress={onPressAction}
              className={`rounded-full px-3 py-2 ${
                effectiveTone === "highlight"
                  ? "border border-white/25 bg-white/15"
                  : "border border-white/15 bg-white"
              }`}
            >
              <Text
                className={`font-gothamMedium text-xs ${
                  effectiveTone === "highlight" ? "text-white" : "text-red-700"
                }`}
              >
                {actionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}

          {secondaryActionLabel && onPressSecondaryAction ? (
            <TouchableOpacity
              onPress={onPressSecondaryAction}
              className={`rounded-full px-3 py-2 ${
                effectiveTone === "highlight"
                  ? "border border-white/20 bg-black/10"
                  : "border border-neutral-200 bg-neutral-100"
              }`}
            >
              <Text
                className={`font-gothamMedium text-xs ${
                  effectiveTone === "highlight" ? "text-white" : "text-neutral-600"
                }`}
              >
                {secondaryActionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[46%] flex-1 rounded-2xl border border-white/10 bg-red-600 p-4 shadow">
      <Text className="font-gothamBold text-3xl text-white">{value}</Text>
      <Text className="mt-1 font-gothamLight text-xs uppercase tracking-[1px] text-red-100">
        {label}
      </Text>
    </View>
  );
}

export function FilterChip({
  label,
  active,
  variant,
  onPress,
}: {
  label: string;
  active: boolean;
  variant?: "default" | "accent";
  onPress: () => void;
}) {
  const isAccent = variant === "accent";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${
        active
          ? "border-red-600 bg-red-600"
          : "border-neutral-200 bg-white"
      }`}
    >
      <Text
        className={`font-gothamMedium text-sm ${
          active ? "text-white" : "text-neutral-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatRewardStatus(status?: string) {
  switch (status) {
    case "pending":
      return "Pending fulfillment";
    case "fulfilled":
      return "Fulfilled";
    default:
      return "Completed";
  }
}
