/**
 * Harbor Lane (fictional demo) inquiry delivery. `forceMock` means the
 * route NEVER contacts the email provider for this brand — a demonstration
 * site must not be able to send anything, whatever the environment says.
 */
export const inquiryConfig = {
  recipients: ["inquiries@harbor-lane.example"],
  from: "Harbor Lane Website <website@harbor-lane.example>",
  subjectPrefix: "Website inquiry (demo)",
  sourceLabel: "harbor-lane.example/contact (fictional demo)",
  env: {
    apiKey: "RESEND_API_KEY",
    recipient: "INQUIRY_RECIPIENT",
    from: "INQUIRY_FROM",
    delivery: "INQUIRY_DELIVERY",
  },
  rateLimit: { windowMs: 10 * 60 * 1000, maxPerWindow: 5 },
  forceMock: true,
} as const;
