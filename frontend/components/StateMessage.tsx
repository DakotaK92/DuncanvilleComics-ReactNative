import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StateMessage({
  title,
  message,
  actionLabel,
  onPressAction,
  loading,
  light = false,
}: {
  title: string;
  message?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  loading?: boolean;
  light?: boolean;
}) {
  const panelClassName = light ? "bg-white/95" : "bg-neutral-900/90";
  const titleClassName = light ? "text-neutral-950" : "text-white";
  const bodyClassName = light ? "text-neutral-700" : "text-neutral-300";
  const iconColor = light ? "#dc2626" : "#f87171";
  const spinnerColor = light ? "#111111" : "#ffffff";

  return (
    <View className={`items-center rounded-2xl px-6 py-10 ${panelClassName}`}>
      <View className="rounded-full bg-red-600/20 p-4">
        {loading ? (
          <ActivityIndicator color={spinnerColor} />
        ) : (
          <Ionicons name="alert-circle-outline" size={28} color={iconColor} />
        )}
      </View>
      <Text className={`mt-4 text-center font-gothamBold text-xl ${titleClassName}`}>
        {title}
      </Text>
      {message ? (
        <Text className={`mt-2 text-center font-gothamLight text-sm leading-5 ${bodyClassName}`}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onPressAction ? (
        <TouchableOpacity
          onPress={onPressAction}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5"
        >
          <Text className="font-gothamMedium text-white">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
