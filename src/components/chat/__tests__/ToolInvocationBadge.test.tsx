import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("shows 'Editing code' for str_replace_editor with no command", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" state="result" result="ok" />);
  expect(screen.getByText("Editing code")).toBeDefined();
});

test("shows 'Creating file' for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("shows 'Editing file' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Editing file")).toBeDefined();
});

test("shows 'Reading file' for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "view" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Reading file")).toBeDefined();
});

test("shows 'Inserting code' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "insert" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Inserting code")).toBeDefined();
});

test("shows 'Undoing edit' for str_replace_editor undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Undoing edit")).toBeDefined();
});

test("shows 'Renaming file' for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "rename" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Renaming file")).toBeDefined();
});

test("shows 'Deleting file' for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "delete" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Deleting file")).toBeDefined();
});

test("shows 'Managing files' for file_manager with no command", () => {
  render(<ToolInvocationBadge toolName="file_manager" state="result" result="ok" />);
  expect(screen.getByText("Managing files")).toBeDefined();
});

test("falls back to raw tool name for unknown tools", () => {
  render(<ToolInvocationBadge toolName="unknown_tool" state="result" result="ok" />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("shows loading indicator when state is call", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" state="call" />);
  expect(screen.getByTestId("loading-indicator")).toBeDefined();
  expect(screen.queryByTestId("done-indicator")).toBeNull();
});

test("shows loading indicator when state is partial-call", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" state="partial-call" />);
  expect(screen.getByTestId("loading-indicator")).toBeDefined();
  expect(screen.queryByTestId("done-indicator")).toBeNull();
});

test("shows done indicator when state is result with a result value", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" state="result" result="ok" />);
  expect(screen.getByTestId("done-indicator")).toBeDefined();
  expect(screen.queryByTestId("loading-indicator")).toBeNull();
});

test("shows loading indicator when state is result but result is null/undefined", () => {
  render(<ToolInvocationBadge toolName="str_replace_editor" state="result" result={undefined} />);
  expect(screen.getByTestId("loading-indicator")).toBeDefined();
});
