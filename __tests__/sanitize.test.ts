import { sanitizeInput } from "@/app/utils/sanitize";

describe("sanitizeInput", () => {
  it("removes script tags", () => {
    const dirty = `<script>alert("xss")</script>Hello`;
    const clean = sanitizeInput(dirty);

    expect(clean).toBe("Hello");
  });
});
