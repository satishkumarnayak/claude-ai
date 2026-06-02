import { test, expect } from "vitest";
import { buildFileManagerTool } from "@/lib/tools/file-manager";
import { VirtualFileSystem } from "@/lib/file-system";

function makeFs() {
  const fs = new VirtualFileSystem();
  fs.createFile("/test.txt", "content");
  fs.createDirectory("/src");
  fs.createFile("/src/index.ts", "export {}");
  return fs;
}

test("rename command renames a file", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/test.txt", new_path: "/renamed.txt" });
  expect((result as { success: boolean }).success).toBe(true);
  expect(fs.exists("/test.txt")).toBe(false);
  expect(fs.exists("/renamed.txt")).toBe(true);
});

test("rename command returns error when new_path not provided", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/test.txt" });
  expect((result as { success: boolean }).success).toBe(false);
  expect((result as { error: string }).error).toContain("new_path is required");
});

test("rename command returns error when source doesn't exist", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/nonexistent.txt", new_path: "/new.txt" });
  expect((result as { success: boolean }).success).toBe(false);
});

test("delete command deletes a file", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/test.txt" });
  expect((result as { success: boolean }).success).toBe(true);
  expect(fs.exists("/test.txt")).toBe(false);
});

test("delete command deletes a directory recursively", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/src" });
  expect((result as { success: boolean }).success).toBe(true);
  expect(fs.exists("/src")).toBe(false);
  expect(fs.exists("/src/index.ts")).toBe(false);
});

test("delete command returns error when file doesn't exist", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/nonexistent.txt" });
  expect((result as { success: boolean }).success).toBe(false);
});

test("success message contains file paths", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/test.txt", new_path: "/renamed.txt" }) as { message: string };
  expect(result.message).toContain("/test.txt");
  expect(result.message).toContain("/renamed.txt");
});

test("delete success message contains path", async () => {
  const fs = makeFs();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/test.txt" }) as { message: string };
  expect(result.message).toContain("/test.txt");
});
