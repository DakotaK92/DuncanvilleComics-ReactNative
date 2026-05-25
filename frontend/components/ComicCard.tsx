import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import type { RemoteComicBook } from "../utils/apiTypes";
const logoImage = require("../assets/icons/logo.png");

export function ComicCard({
  comic,
  actionLabel,
  onPressAction,
  actionDisabled,
  secondaryActionLabel,
  onPressSecondaryAction,
  secondaryActionDisabled,
  accentLabel,
}: {
  comic: RemoteComicBook;
  actionLabel?: string;
  onPressAction?: () => void;
  actionDisabled?: boolean;
  secondaryActionLabel?: string;
  onPressSecondaryAction?: () => void;
  secondaryActionDisabled?: boolean;
  accentLabel?: string;
}) {
  const preferredImageSource = useMemo(
    () => (comic.coverImageUrl ? { uri: comic.coverImageUrl } : comic.coverImage),
    [comic.coverImage, comic.coverImageUrl]
  );
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  useEffect(() => {
    setUseFallbackImage(false);
  }, [preferredImageSource]);

  const shouldShowFallbackCover = useFallbackImage || !preferredImageSource;
  const fallbackBadge = useMemo(() => {
    if (accentLabel === "This week") {
      return "Weekly Release";
    }

    if (comic.grade) {
      return "CGC Graded";
    }

    if (comic.dealPrice) {
      return "Deal of the Week";
    }

    if (actionLabel === "Add to wish list" || secondaryActionLabel === "Remove") {
      return "Back Issue";
    }

    if (actionLabel === "Add to pull list" || comic.hasNewIssue) {
      return "Pull List";
    }

    return "Comic Pick";
  }, [
    accentLabel,
    actionLabel,
    comic.dealPrice,
    comic.grade,
    comic.hasNewIssue,
    secondaryActionLabel,
  ]);

  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow">
      <View className="flex-row">
        {shouldShowFallbackCover ? (
          <View className="h-40 w-28 items-center justify-between overflow-hidden bg-red-600 px-3 py-4">
            <View className="self-start rounded-full bg-white/15 px-2 py-1">
              <Text className="font-gothamBold text-[10px] uppercase text-white">
                {fallbackBadge}
              </Text>
            </View>
            <Image
              source={logoImage}
              className="h-10 w-20"
              contentFit="contain"
              transition={120}
            />
            <View className="items-center">
              <Text className="text-center font-gothamBold text-xs text-white">
                Cover unavailable
              </Text>
              <Text className="mt-1 text-center font-gothamLight text-[10px] leading-3 text-red-100">
                Duncanville Comics fallback art
              </Text>
            </View>
          </View>
        ) : (
          <Image
            source={preferredImageSource}
            className="h-40 w-28 bg-neutral-200"
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={180}
            onError={() => setUseFallbackImage(true)}
          />
        )}

        <View className="flex-1 p-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="font-gothamBold text-base text-neutral-900">
                {comic.title} #{comic.issue}
              </Text>
              <Text className="mt-1 font-gothamLight text-sm text-neutral-500">
                {comic.publisher}
              </Text>
            </View>

            {accentLabel ? (
              <View className="rounded-full bg-red-100 px-2 py-1">
                <Text className="font-gothamMedium text-xs text-red-700">
                  {accentLabel}
                </Text>
              </View>
            ) : null}
          </View>

          {comic.grade ? (
            <Text className="mt-2 font-gothamMedium text-sm text-green-600">
              CGC {comic.grade}
            </Text>
          ) : null}

          {comic.dealPrice ? (
            <View className="mt-3 flex-row items-center">
              <Text className="mr-2 font-gothamLight text-sm text-neutral-400 line-through">
                ${comic.price.toFixed(2)}
              </Text>
              <Text className="font-gothamBold text-base text-red-600">
                ${comic.dealPrice.toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text className="mt-3 font-gothamBold text-base text-neutral-900">
              ${comic.price.toFixed(2)}
            </Text>
          )}

          {comic.hasNewIssue ? (
            <Text className="mt-2 font-gothamMedium text-sm text-emerald-600">
              New issue ready this week
            </Text>
          ) : null}

          {comic.notes ? (
            <Text className="mt-2 font-gothamLight text-xs text-neutral-500">
              {comic.notes}
            </Text>
          ) : null}

          {(actionLabel && onPressAction) || (secondaryActionLabel && onPressSecondaryAction) ? (
            <View className="mt-4 flex-row gap-2">
              {actionLabel && onPressAction ? (
                <TouchableOpacity
                  disabled={actionDisabled}
                  onPress={onPressAction}
                  className={`rounded-xl px-3 py-2 ${
                    actionDisabled ? "bg-neutral-300" : "bg-red-600"
                  }`}
                >
                  <Text
                    className={`font-gothamMedium text-sm ${
                      actionDisabled ? "text-neutral-600" : "text-white"
                    }`}
                  >
                    {actionLabel}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {secondaryActionLabel && onPressSecondaryAction ? (
                <TouchableOpacity
                  disabled={secondaryActionDisabled}
                  onPress={onPressSecondaryAction}
                  className={`rounded-xl border px-3 py-2 ${
                    secondaryActionDisabled
                      ? "border-neutral-200 bg-neutral-100"
                      : "border-neutral-300"
                  }`}
                >
                  <Text
                    className={`font-gothamMedium text-sm ${
                      secondaryActionDisabled ? "text-neutral-400" : "text-neutral-700"
                    }`}
                  >
                    {secondaryActionLabel}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
