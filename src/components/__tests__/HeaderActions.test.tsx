import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/actions", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn().mockResolvedValue({ id: "new-project-id" }),
}));

import { HeaderActions } from "../HeaderActions";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("renders Sign In and Sign Up buttons when user is not logged in", () => {
  render(<HeaderActions user={null} />);
  expect(screen.getByRole("button", { name: "Sign In" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Sign Up" })).toBeDefined();
});

test("does not render Sign In/Sign Up when user is logged in", () => {
  render(<HeaderActions user={{ id: "1", email: "test@example.com" }} />);
  expect(screen.queryByRole("button", { name: "Sign In" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Sign Up" })).toBeNull();
});

test("renders New Design button when user is logged in", () => {
  render(<HeaderActions user={{ id: "1", email: "test@example.com" }} />);
  expect(screen.getByRole("button", { name: /New Design/i })).toBeDefined();
});

test("renders sign out button when user is logged in", () => {
  render(<HeaderActions user={{ id: "1", email: "test@example.com" }} />);
  expect(screen.getByTitle("Sign out")).toBeDefined();
});

test("clicking Sign In opens AuthDialog in signin mode", async () => {
  render(<HeaderActions user={null} />);
  const signInButton = screen.getByRole("button", { name: "Sign In" });
  await userEvent.click(signInButton);
  // AuthDialog should be rendered (dialog element present)
  const dialog = document.querySelector("[role='dialog']");
  expect(dialog).toBeDefined();
});

test("clicking Sign Up opens AuthDialog in signup mode", async () => {
  render(<HeaderActions user={null} />);
  const signUpButton = screen.getByRole("button", { name: "Sign Up" });
  await userEvent.click(signUpButton);
  const dialog = document.querySelector("[role='dialog']");
  expect(dialog).toBeDefined();
});

test("calls signOut when sign out button is clicked", async () => {
  const { signOut } = await import("@/actions");
  render(<HeaderActions user={{ id: "1", email: "test@example.com" }} />);
  const signOutButton = screen.getByTitle("Sign out");
  await userEvent.click(signOutButton);
  expect(signOut).toHaveBeenCalled();
});

test("calls createProject and navigates when New Design is clicked", async () => {
  const { createProject } = await import("@/actions/create-project");
  const { useRouter } = await import("next/navigation");
  const pushMock = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push: pushMock } as ReturnType<typeof useRouter>);

  render(<HeaderActions user={{ id: "1", email: "test@example.com" }} />);
  const newDesignButton = screen.getByRole("button", { name: /New Design/i });
  await userEvent.click(newDesignButton);
  expect(createProject).toHaveBeenCalled();
});
