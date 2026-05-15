import { Text, View } from "react-native";

export default function ToastBanner({
  message,
  tone = "success",
}: {
  message: string;
  tone?: "success" | "error" | "info";
}) {
  const toneClassName =
    tone === "error"
      ? "bg-red-600"
      : tone === "info"
        ? "bg-neutral-900/90"
        : "bg-emerald-600";

  return (
    <View className={`absolute left-4 right-4 top-4 z-20 rounded-xl px-4 py-3 shadow ${toneClassName}`}>
      <Text className="text-center font-gothamMedium text-sm text-white">{message}</Text>
    </View>
  );
}
