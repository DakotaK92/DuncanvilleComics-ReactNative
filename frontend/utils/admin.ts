export const PRIMARY_ADMIN_EMAIL = "dakotaking92@gmail.com";

export const isPrimaryAdminEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase() === PRIMARY_ADMIN_EMAIL;
