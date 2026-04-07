import { describe, expect, it } from "vitest";
import { JERS_CAL_30MIN_BOOKING_URL } from "./jersBooking";

describe("jersBooking", () => {
  it("uses the production Cal.com 30min scheduling URL", () => {
    expect(JERS_CAL_30MIN_BOOKING_URL).toBe("https://cal.com/monitor-jers-zrnnsq/30min");
    expect(JERS_CAL_30MIN_BOOKING_URL).toMatch(/^https:\/\/cal\.com\//);
  });
});
