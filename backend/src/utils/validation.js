import mongoose from "mongoose";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const fail = (message, status = 400) => {
  throw new HttpError(status, message);
};

export const normalizeSeriesKey = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const readRequiredString = (
  value,
  { field, max = 160, min = 1, preserveWhitespace = false } = {}
) => {
  const normalized = preserveWhitespace ? String(value ?? "") : String(value ?? "").trim();

  if (!normalized || normalized.length < min) {
    fail(`${field} is required.`);
  }

  if (normalized.length > max) {
    fail(`${field} must be ${max} characters or fewer.`);
  }

  return normalized;
};

export const readOptionalString = (
  value,
  { max = 500, preserveWhitespace = false, defaultValue = "" } = {}
) => {
  if (value == null) {
    return defaultValue;
  }

  const normalized = preserveWhitespace ? String(value) : String(value).trim();

  if (normalized.length > max) {
    fail(`Text must be ${max} characters or fewer.`);
  }

  return normalized;
};

export const readNumber = (
  value,
  { field, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, integer = false } = {}
) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    fail(`${field} must be a valid number.`);
  }

  if (integer && !Number.isInteger(parsed)) {
    fail(`${field} must be a whole number.`);
  }

  if (parsed < min) {
    fail(`${field} must be at least ${min}.`);
  }

  if (parsed > max) {
    fail(`${field} must be ${max} or less.`);
  }

  return parsed;
};

export const readBoolean = (value, { field, defaultValue = false } = {}) => {
  if (value == null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  fail(`${field} must be true or false.`);
};

export const readDate = (value, { field } = {}) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    fail(`${field} must be a valid date.`);
  }

  return parsed;
};

export const readEnum = (value, allowed, { field } = {}) => {
  if (!allowed.includes(value)) {
    fail(`${field} must be one of: ${allowed.join(", ")}.`);
  }

  return value;
};

export const readObjectId = (value, { field = "id" } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(String(value ?? ""))) {
    fail(`${field} must be a valid id.`);
  }

  return String(value);
};

export const readEmail = (value, { field = "email", required = false } = {}) => {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) {
    if (required) {
      fail(`${field} is required.`);
    }

    return "";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalized)) {
    fail(`${field} must be a valid email address.`);
  }

  return normalized;
};
