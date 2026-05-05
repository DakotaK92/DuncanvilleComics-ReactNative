import type { Dispatch, SetStateAction } from "react";
import { Alert, View } from "react-native";

import {
  Field,
  PrimaryButton,
  RecordCard,
  SecondaryButton,
  SectionTitle,
} from "./AdminUi";

type ReleaseFormState = {
  title: string;
  issue: string;
  publisher: string;
  price: string;
  releaseDate: string;
  coverImageUrl: string;
  seriesKey: string;
};

export function AdminReleasesSection({
  editingReleaseId,
  releaseForm,
  emptyReleaseForm,
  releaseMutationPending,
  releaseSearch,
  filteredReleases,
  setReleaseForm,
  setEditingReleaseId,
  setReleaseSearch,
  onSubmit,
  onDelete,
}: {
  editingReleaseId: string | null;
  releaseForm: ReleaseFormState;
  emptyReleaseForm: ReleaseFormState;
  releaseMutationPending: boolean;
  releaseSearch: string;
  filteredReleases: any[];
  setReleaseForm: Dispatch<SetStateAction<ReleaseFormState>>;
  setEditingReleaseId: Dispatch<SetStateAction<string | null>>;
  setReleaseSearch: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View className="gap-4">
      <SectionTitle
        title={editingReleaseId ? "Edit Weekly Release" : "Add Weekly Release"}
        subtitle="Create, update, or remove the books customers can add to their pull lists."
        lightPanel
      />
      <View className="gap-3">
        <Field
          label="Title"
          value={releaseForm.title}
          darkLabel
          onChangeText={(value) => setReleaseForm((current) => ({ ...current, title: value }))}
        />
        <Field
          label="Issue"
          value={releaseForm.issue}
          keyboardType="numeric"
          darkLabel
          onChangeText={(value) => setReleaseForm((current) => ({ ...current, issue: value }))}
        />
        <Field
          label="Publisher"
          value={releaseForm.publisher}
          darkLabel
          onChangeText={(value) => setReleaseForm((current) => ({ ...current, publisher: value }))}
        />
        <Field
          label="Price"
          value={releaseForm.price}
          keyboardType="decimal-pad"
          darkLabel
          onChangeText={(value) => setReleaseForm((current) => ({ ...current, price: value }))}
        />
        <Field
          label="Release Date (YYYY-MM-DD)"
          value={releaseForm.releaseDate}
          darkLabel
          onChangeText={(value) =>
            setReleaseForm((current) => ({ ...current, releaseDate: value }))
          }
        />
        <Field
          label="Series Key"
          value={releaseForm.seriesKey}
          darkLabel
          onChangeText={(value) =>
            setReleaseForm((current) => ({ ...current, seriesKey: value }))
          }
        />
        <Field
          label="Cover Image URL"
          value={releaseForm.coverImageUrl}
          darkLabel
          onChangeText={(value) =>
            setReleaseForm((current) => ({ ...current, coverImageUrl: value }))
          }
        />
      </View>
      <View className="flex-row gap-2">
        <PrimaryButton
          label={
            releaseMutationPending
              ? "Saving..."
              : editingReleaseId
                ? "Update release"
                : "Create release"
          }
          onPress={onSubmit}
        />
        {(editingReleaseId || releaseForm.title) && (
          <SecondaryButton
            label="Clear"
            onPress={() => {
              setEditingReleaseId(null);
              setReleaseForm(emptyReleaseForm);
            }}
          />
        )}
      </View>
      <Field
        label="Search releases"
        value={releaseSearch}
        darkLabel
        onChangeText={setReleaseSearch}
      />
      <SectionTitle
        title="Current Weekly Releases"
        subtitle={`${filteredReleases.length} matching books`}
        lightPanel
      />
      {filteredReleases.map((release: any) => (
        <RecordCard
          key={release.id}
          title={`${release.title} #${release.issue}`}
          tone="highlight"
          subtitle={`${release.publisher} â€¢ $${Number(release.price).toFixed(2)} â€¢ ${String(
            release.releaseDate
          ).slice(0, 10)}`}
          actionLabel="Edit"
          onPressAction={() => {
            setEditingReleaseId(release.id);
            setReleaseForm({
              title: release.title,
              issue: String(release.issue),
              publisher: release.publisher,
              price: String(release.price),
              releaseDate: String(release.releaseDate).slice(0, 10),
              coverImageUrl: release.coverImageUrl || "",
              seriesKey: release.seriesKey || "",
            });
          }}
          secondaryActionLabel="Delete"
          onPressSecondaryAction={() =>
            Alert.alert("Delete release", `Remove ${release.title} #${release.issue}?`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(release.id),
              },
            ])
          }
        />
      ))}
    </View>
  );
}
