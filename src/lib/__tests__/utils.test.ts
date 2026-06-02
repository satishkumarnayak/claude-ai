import { test, expect } from "vitest";
import { cn } from "@/lib/utils";

test("returns empty string for no arguments", () => {
  expect(cn()).toBe("");
});

test("returns class name for single string", () => {
  expect(cn("foo")).toBe("foo");
});

test("merges multiple class names", () => {
  expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
});

test("filters out falsy values", () => {
  expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
});

test("handles conditional classes", () => {
  expect(cn("base", true && "active", false && "inactive")).toBe("base active");
});

test("deduplicates tailwind conflicting classes", () => {
  expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
});

test("handles object syntax", () => {
  expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
});

test("handles array syntax", () => {
  expect(cn(["foo", "bar"])).toBe("foo bar");
});

test("merges padding classes correctly", () => {
  expect(cn("p-4", "px-2")).toBe("p-4 px-2");
});

test("last tailwind class wins for same property", () => {
  expect(cn("bg-red-500", "bg-green-500")).toBe("bg-green-500");
});
