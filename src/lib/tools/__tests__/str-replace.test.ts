import { test, expect } from "vitest";
import { buildStrReplaceTool } from "@/lib/tools/str-replace";
import { VirtualFileSystem } from "@/lib/file-system";

function makeFs() {
  const fs = new VirtualFileSystem();
  fs.createFile("/test.txt", "hello world\nhello again");
  return fs;
}

test("view command returns file content with line numbers", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "view", path: "/test.txt" });
  expect(result).toContain("hello world");
  expect(result).toContain("1\t");
});

test("view command with view_range returns partial content", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({
    command: "view",
    path: "/test.txt",
    view_range: [1, 1],
  });
  expect(result).toContain("hello world");
  expect(result).not.toContain("hello again");
});

test("create command creates a new file", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({
    command: "create",
    path: "/new.txt",
    file_text: "new content",
  });
  expect(result).toContain("/new.txt");
  expect(fs.readFile("/new.txt")).toBe("new content");
});

test("create command creates file with empty content when file_text not provided", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "create", path: "/empty.txt" });
  expect(fs.readFile("/empty.txt")).toBe("");
});

test("str_replace command replaces text in file", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({
    command: "str_replace",
    path: "/test.txt",
    old_str: "hello world",
    new_str: "goodbye world",
  });
  expect(result).toContain("Replaced");
  expect(fs.readFile("/test.txt")).toContain("goodbye world");
});

test("str_replace command uses empty strings when params not provided", async () => {
  const fs = new VirtualFileSystem();
  fs.createFile("/test.txt", "foo bar");
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({
    command: "str_replace",
    path: "/test.txt",
  });
  expect(result).toContain("Error");
});

test("insert command inserts text at specified line", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({
    command: "insert",
    path: "/test.txt",
    insert_line: 1,
    new_str: "inserted line",
  });
  expect(result).toContain("inserted");
  const content = fs.readFile("/test.txt");
  expect(content).toContain("inserted line");
});

test("undo_edit command returns unsupported error", async () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "undo_edit", path: "/test.txt" });
  expect(result).toContain("Error");
  expect(result).toContain("undo_edit");
});

test("tool has correct id", () => {
  const fs = makeFs();
  const tool = buildStrReplaceTool(fs);
  expect(tool.id).toBe("str_replace_editor");
});
