import type { Dispatch, SetStateAction } from "react";
import { Alert, Text, View } from "react-native";

import {
  Field,
  PrimaryButton,
  RecordCard,
  SecondaryButton,
  SectionTitle,
} from "./AdminUi";
import type {
  AdminWeeklyRelease,
  ReleaseFormState,
  WeeklyReleaseImportPreview,
} from "./types";

export function AdminReleasesSection({
  editingReleaseId,
  releaseForm,
  emptyReleaseForm,
  releaseMutationPending,
  releaseSearch,
  importCsvText,
  releaseImportPreview,
  previewImportPending,
  publishImportPending,
  filteredReleases,
  setReleaseForm,
  setEditingReleaseId,
  setReleaseSearch,
  setImportCsvText,
  onSubmit,
  onPreviewImport,
  onPublishImport,
  onDelete,
}: {
  editingReleaseId: string | null;
  releaseForm: ReleaseFormState;
  emptyReleaseForm: ReleaseFormState;
  releaseMutationPending: boolean;
  releaseSearch: string;
  importCsvText: string;
  releaseImportPreview: WeeklyReleaseImportPreview | null;
  previewImportPending: boolean;
  publishImportPending: boolean;
  filteredReleases: AdminWeeklyRelease[];
  setReleaseForm: Dispatch<SetStateAction<ReleaseFormState>>;
  setEditingReleaseId: Dispatch<SetStateAction<string | null>>;
  setReleaseSearch: Dispatch<SetStateAction<string>>;
  setImportCsvText: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  onPreviewImport: () => void;
  onPublishImport: () => void;
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
      <SectionTitle
        title="Weekly CSV Import"
        subtitle="Paste the distributor CSV for the new week, preview what will publish, then replace the current weekly release shelf in one move."
        lightPanel
      />
      <Field
        label="Weekly release CSV"
        value={importCsvText}
        multiline
        darkLabel
        onChangeText={setImportCsvText}
      />
      <View className="flex-row flex-wrap gap-2">
        <PrimaryButton
          label={previewImportPending ? "Previewing..." : "Preview import"}
          onPress={onPreviewImport}
          disabled={previewImportPending || publishImportPending || !importCsvText.trim()}
        />
        <PrimaryButton
          label={publishImportPending ? "Publishing..." : "Publish this week"}
          onPress={onPublishImport}
          disabled={
            publishImportPending ||
            previewImportPending ||
            !importCsvText.trim() ||
            !releaseImportPreview ||
            releaseImportPreview.summary.validRows === 0 ||
            releaseImportPreview.summary.invalidRows > 0
          }
        />
      </View>
      {releaseImportPreview ? (
        <View className="gap-3 rounded-2xl border border-red-200 bg-white p-4">
          <SectionTitle
            title="Import Preview"
            subtitle={`${releaseImportPreview.summary.validRows} valid rows | ${releaseImportPreview.summary.invalidRows} flagged rows`}
            lightPanel
          />
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-red-600 px-4 py-2">
              <View>
                <RecordPillText label={`Rows ${releaseImportPreview.summary.totalRows}`} />
              </View>
            </View>
            <View className="rounded-full bg-red-600 px-4 py-2">
              <View>
                <RecordPillText label={`Ready ${releaseImportPreview.summary.validRows}`} />
              </View>
            </View>
            {releaseImportPreview.summary.invalidRows > 0 ? (
              <View className="rounded-full bg-neutral-900 px-4 py-2">
                <View>
                  <RecordPillText label={`Fix ${releaseImportPreview.summary.invalidRows}`} />
                </View>
              </View>
            ) : null}
          </View>
          {releaseImportPreview.errors.map((error) => (
            <RecordCard
              key={`error-${error.lineNumber}-${error.message}`}
              title={`Line ${error.lineNumber}${error.title ? ` | ${error.title}` : ""}`}
              subtitle={error.message}
              tone="highlight"
            />
          ))}
          {releaseImportPreview.releases.slice(0, 6).map((release) => (
            <RecordCard
              key={`preview-${release.lineNumber}-${release.seriesKey}`}
              title={`${release.title} #${release.issue}`}
              subtitle={`${release.publisher} | $${Number(release.price).toFixed(2)} | ${String(
                release.releaseDate
              ).slice(0, 10)}`}
              tone="highlight"
            />
          ))}
        </View>
      ) : null}
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
      {filteredReleases.map((release: AdminWeeklyRelease) => (
        <RecordCard
          key={release.id}
          title={`${release.title} #${release.issue}`}
          tone="highlight"
          subtitle={`${release.publisher} | $${Number(release.price).toFixed(2)} | ${String(
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

function RecordPillText({ label }: { label: string }) {
  return <Text className="font-gothamMedium text-sm text-white">{label}</Text>;
}
