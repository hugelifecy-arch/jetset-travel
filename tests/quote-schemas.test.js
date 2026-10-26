/**
 * /api/quote request schemas (src/lib/quote-schemas.ts).
 *
 * The union must keep resolving every pre-existing payload (corporate, luxury
 * without trip types, untyped quick lead) to the same member it did before
 * the VIP airport form was added.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CorporateSchema,
  LuxurySchema,
  VipSchema,
  LeadSchema,
  QuoteSchema,
  TRIP_TYPES,
  formatTripTypes,
  quoteTypeLabel,
} from "../src/lib/quote-schemas.ts";

const corporate = {
  type: "corporate", companyName: "Acme Ltd", email: "ops@example.com", phone: "+35799000000",
  travellers: "4", travelDates: "12–15 Mar", destinations: "London", invoiceRequired: true, notes: "",
};
const luxury = {
  type: "luxury", name: "Anna Example", email: "anna@example.com", phone: "+35799000000",
  destinations: "Santorini", dates: "June 2027", groupSize: "2 adults", budget: "5k-10k",
  specialRequirements: "",
};
const vip = {
  type: "vip", name: "Anna Example", email: "anna@example.com", phone: "+35799000000",
  airport: "LCA", service: "arrival", date: "14 June 2027", flightNumber: "A3 612",
  passengers: "2 adults", notes: "",
};
const lead = { name: "Anna Example", phone: "+35799000000", route: "Paphos to Athens" };

describe("QuoteSchema union", () => {
  it("resolves existing payloads exactly as before", () => {
    assert.deepEqual(QuoteSchema.parse(corporate), CorporateSchema.parse(corporate));
    assert.deepEqual(QuoteSchema.parse(luxury), LuxurySchema.parse(luxury));
    assert.equal("tripTypes" in QuoteSchema.parse(luxury), false);
    assert.deepEqual(QuoteSchema.parse(lead), LeadSchema.parse(lead));
    assert.equal("type" in QuoteSchema.parse(lead), false);
  });

  it("accepts a VIP airport request and labels it VIP", () => {
    const data = QuoteSchema.parse(vip);
    assert.equal(data.type, "vip");
    assert.equal(quoteTypeLabel(data), "VIP");
    assert.equal(quoteTypeLabel(QuoteSchema.parse(luxury)), "Luxury");
    assert.equal(quoteTypeLabel(QuoteSchema.parse(corporate)), "Corporate");
    assert.equal(quoteTypeLabel(QuoteSchema.parse(lead)), "Quick");
  });

  it("rejects malformed VIP requests", () => {
    for (const patch of [
      { airport: "ATH" },
      { airport: undefined },
      { service: "transfer" },
      { flightNumber: "A3-612" },
      { flightNumber: "A3612<script>" },
      { flightNumber: "ABCDEFGHIJKLM" },
      { passengers: "" },
      { passengers: "x".repeat(21) },
      { date: "" },
      { name: "A" },
      { email: "not-an-email" },
      { phone: "123" },
      { notes: "x".repeat(2001) },
    ]) {
      assert.equal(QuoteSchema.safeParse({ ...vip, ...patch }).success, false, JSON.stringify(patch));
    }
  });

  it("treats the flight number as optional", () => {
    assert.equal(VipSchema.safeParse({ ...vip, flightNumber: undefined }).success, true);
    assert.equal(VipSchema.safeParse({ ...vip, flightNumber: "" }).success, true);
    assert.equal(VipSchema.safeParse({ ...vip, service: "both", airport: "PFO" }).success, true);
  });
});

describe("luxury trip types", () => {
  it("accepts any combination of the known trip types", () => {
    assert.equal(LuxurySchema.safeParse({ ...luxury, tripTypes: [] }).success, true);
    assert.equal(LuxurySchema.safeParse({ ...luxury, tripTypes: [...TRIP_TYPES] }).success, true);
    assert.equal(QuoteSchema.parse({ ...luxury, tripTypes: ["villa", "yacht"] }).type, "luxury");
  });

  it("rejects unknown values and oversized lists", () => {
    assert.equal(QuoteSchema.safeParse({ ...luxury, tripTypes: ["spaceflight"] }).success, false);
    assert.equal(QuoteSchema.safeParse({ ...luxury, tripTypes: "villa" }).success, false);
    assert.equal(
      QuoteSchema.safeParse({ ...luxury, tripTypes: [...TRIP_TYPES, "villa"] }).success,
      false,
    );
  });

  it("formats trip types once each, in a fixed order", () => {
    assert.equal(formatTripTypes(["yacht", "cruise", "yacht"]), "Cruise, Yacht charter");
    assert.equal(formatTripTypes(["vip-airport"]), "VIP airport service");
    assert.equal(formatTripTypes(undefined), "");
  });
});
