import { View, Text, Image, TouchableOpacity } from "react-native";
import { ComicBook } from "../data/categoryComics";

type RemoteComicBook = ComicBook & {
  coverImageUrl?: string;
  hasNewIssue?: boolean;
  notes?: string;
};

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
  const imageSource = comic.coverImageUrl ? { uri: comic.coverImageUrl } : comic.coverImage;

  return (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow">
      <View className="flex-row">
        <Image source={imageSource} className="h-40 w-28" resizeMode="cover" />

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
              <Text className="mr-2 text-sm text-gray-400 line-through">
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
                  className={`rounded-md px-3 py-2 ${
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
                  className={`rounded-md border px-3 py-2 ${
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
