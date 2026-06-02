import { test, expect, beforeEach } from "vitest";
import {
  setHasAnonWork,
  getHasAnonWork,
  getAnonWorkData,
  clearAnonWork,
} from "@/lib/anon-work-tracker";

beforeEach(() => {
  sessionStorage.clear();
});

test("getHasAnonWork returns false when nothing is stored", () => {
  expect(getHasAnonWork()).toBe(false);
});

test("setHasAnonWork stores data when messages exist", () => {
  setHasAnonWork([{ role: "user", content: "hello" }], {});
  expect(getHasAnonWork()).toBe(true);
});

test("setHasAnonWork stores data when fileSystemData has entries beyond root", () => {
  setHasAnonWork([], { "/": {}, "/file.txt": "content" });
  expect(getHasAnonWork()).toBe(true);
});

test("setHasAnonWork does not set when no messages and only root in fileSystem", () => {
  setHasAnonWork([], { "/": {} });
  expect(getHasAnonWork()).toBe(false);
});

test("setHasAnonWork does not set when empty messages and empty fileSystem", () => {
  setHasAnonWork([], {});
  expect(getHasAnonWork()).toBe(false);
});

test("getAnonWorkData returns null when nothing is stored", () => {
  expect(getAnonWorkData()).toBeNull();
});

test("getAnonWorkData returns stored data", () => {
  const messages = [{ role: "user", content: "hello" }];
  const fileSystemData = { "/file.txt": "content" };
  setHasAnonWork(messages, fileSystemData);

  const data = getAnonWorkData();
  expect(data).not.toBeNull();
  expect(data?.messages).toEqual(messages);
  expect(data?.fileSystemData).toEqual(fileSystemData);
});

test("clearAnonWork removes stored data", () => {
  setHasAnonWork([{ role: "user", content: "hello" }], {});
  expect(getHasAnonWork()).toBe(true);

  clearAnonWork();
  expect(getHasAnonWork()).toBe(false);
  expect(getAnonWorkData()).toBeNull();
});

test("getAnonWorkData returns null for invalid JSON", () => {
  sessionStorage.setItem("uigen_anon_data", "invalid-json{");
  expect(getAnonWorkData()).toBeNull();
});
