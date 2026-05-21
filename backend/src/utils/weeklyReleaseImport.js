import {
  HttpError,
  normalizeSeriesKey,
  readDate,
  readNumber,
  readOptionalString,
  readRequiredString,
} from "./validation.js";

const REQUIRED_HEADERS = ["title", "issue", "publisher", "price", "releaseDate"];

const HEADER_ALIASES = {
  title: "title",
  issue: "issue",
  issuenumber: "issue",
  publisher: "publisher",
  price: "price",
  releasedate: "releaseDate",
  release_date: "releaseDate",
  release: "releaseDate",
  coverimageurl: "coverImageUrl",
  cover_image_url: "coverImageUrl",
  coverurl: "coverImageUrl",
  serieskey: "seriesKey",
  series_key: "seriesKey",
};

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function parseCsvLine(text) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.replace(/\r/g, "").trim());
}

function parseCsvText(csvText) {
  const normalizedText = String(csvText ?? "").trim();

  if (!normalizedText) {
    throw new HttpError(400, "csvText is required.");
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new HttpError(400, "Add a header row and at least one weekly release row.");
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const headers = rawHeaders.map((header) => HEADER_ALIASES[normalizeHeader(header)] ?? header.trim());
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    throw new HttpError(
      400,
      `Missing required CSV columns: ${missingHeaders.join(", ")}.`
    );
  }

  return { headers, lines: lines.slice(1) };
}

export function parseWeeklyReleaseImport(csvText) {
  const { headers, lines } = parseCsvText(csvText);
  const previewRows = [];
  const importRows = [];
  const rowErrors = [];
  const seenKeys = new Set();

  lines.forEach((line, rowIndex) => {
    const values = parseCsvLine(line);
    const lineNumber = rowIndex + 2;
    const rawRow = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const allValuesEmpty = Object.values(rawRow).every((value) => String(value ?? "").trim().length === 0);

    if (allValuesEmpty) {
      return;
    }

    try {
      const title = readRequiredString(rawRow.title, { field: `title on line ${lineNumber}`, max: 160 });
      const issue = readNumber(rawRow.issue, {
        field: `issue on line ${lineNumber}`,
        min: 0,
        max: 9999,
        integer: true,
      });
      const publisher = readRequiredString(rawRow.publisher, {
        field: `publisher on line ${lineNumber}`,
        max: 80,
      });
      const price = readNumber(rawRow.price, {
        field: `price on line ${lineNumber}`,
        min: 0,
        max: 10000,
      });
      const releaseDate = readDate(rawRow.releaseDate, {
        field: `releaseDate on line ${lineNumber}`,
      });
      const coverImageUrl = readOptionalString(rawRow.coverImageUrl, { max: 500 });
      const seriesKey = normalizeSeriesKey(
        readOptionalString(rawRow.seriesKey, { max: 160 }) || title
      );

      const duplicateKey = `${seriesKey}::${issue}`;
      if (seenKeys.has(duplicateKey)) {
        throw new HttpError(400, `Duplicate weekly release for ${title} #${issue} on line ${lineNumber}.`);
      }
      seenKeys.add(duplicateKey);

      importRows.push({
        title,
        issueNumber: issue,
        publisher,
        price,
        releaseDate,
        coverImageUrl,
        seriesKey,
        status: "current",
        importedAt: new Date(),
      });

      previewRows.push({
        lineNumber,
        title,
        issue,
        publisher,
        price,
        releaseDate: releaseDate.toISOString(),
        coverImageUrl,
        seriesKey,
      });
    } catch (error) {
      rowErrors.push({
        lineNumber,
        title: String(rawRow.title ?? "").trim(),
        message: error instanceof Error ? error.message : "This row is invalid.",
      });
    }
  });

  if (previewRows.length === 0 && rowErrors.length === 0) {
    throw new HttpError(400, "No weekly release rows were found in that CSV.");
  }

  return {
    previewRows,
    importRows,
    rowErrors,
    summary: {
      totalRows: previewRows.length + rowErrors.length,
      validRows: previewRows.length,
      invalidRows: rowErrors.length,
    },
  };
}
