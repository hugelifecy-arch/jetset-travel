import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createPrivateEnquirySchema } from "../src/lib/private-enquiry-schema.ts";

const schema = createPrivateEnquirySchema({ required: "Required", invalidEmail: "Email", invalidPhone: "Phone" });
const person = { name: "John Smith", email: "john@example.com" };
describe("preferred contact validation", () => {
  it("allows email contact without a phone", () => {
    assert.equal(schema.safeParse({ ...person, contactMethod: "email" }).success, true);
  });
  for (const contactMethod of ["phone", "whatsapp"]) {
    it(`requires a usable number for ${contactMethod}`, () => {
      for (const phone of [undefined, "", "  ", "abc12345678", "123", "+".repeat(8)]) {
        assert.equal(schema.safeParse({ ...person, contactMethod, phone }).success, false);
      }
      assert.equal(schema.safeParse({ ...person, contactMethod, phone: "+357 99 478 073" }).success, true);
    });
  }
  it("trims names and rejects oversized messages", () => {
    const data = schema.parse({ ...person, name: " John Smith ", contactMethod: "email" });
    assert.equal(data.name, "John Smith");
    assert.equal(schema.safeParse({ ...person, contactMethod: "email", message: "x".repeat(2001) }).success, false);
  });
});

for (const locale of ["en", "ru"]) {
  it(`provides translated private-form validation messages for ${locale}`, () => {
    const { forms } = JSON.parse(readFileSync(new URL(`../src/messages/${locale}.json`, import.meta.url), "utf8"));
    for (const key of ["required", "invalidEmail", "invalidPhone"]) {
      assert.equal(typeof forms[key], "string", `${locale}: missing forms.${key}`);
      assert.ok(forms[key].trim().length > 0, `${locale}: empty forms.${key}`);
    }
    const result = createPrivateEnquirySchema(forms).safeParse({
      ...person, contactMethod: "whatsapp", phone: "",
    });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some(issue =>
      issue.path.join(".") === "phone" && issue.message === forms.invalidPhone
    ));
  });
}
