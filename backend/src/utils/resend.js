import { Resend } from "resend";
import { ENV } from "../config/env.js";

let resendClient = null;

export const getResendClient = () => {
  if (!ENV.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(ENV.RESEND_API_KEY);
  }

  return resendClient;
};

export const canSendStoreEmail = () =>
  Boolean(ENV.RESEND_API_KEY && ENV.RESEND_FROM_EMAIL && ENV.STORE_EMAIL);

