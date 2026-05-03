import { describe, expect, it } from "vitest";
import { JERS_CAL_30MIN_BOOKING_URL } from "./jersBooking";

describe("jersBooking", () => {
  it("uses the production Cal.com scheduling URL", () => {
    expect(JERS_CAL_30MIN_BOOKING_URL).toBe(
      "https://app.cal.com/jers-consultora-digital?redirect=false",
    );
    expect(JERS_CAL_30MIN_BOOKING_URL).toMatch(/^https:\/\/app\.cal\.com\//);
  });
});
