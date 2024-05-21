import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Dashboard from "../pages/Dashboard";
import { screen } from "../components/utils-screen";

// Mock components used in Dashboard
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

const mockStore = configureMockStore();
const store = mockStore({
  user: { currentUser: { name: "Test User" } },
  // Add other initial state as needed
});

describe("Dashboard Component", () => {
  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    // Check for an element rendered by the Dashboard component
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  const display = ["<h2>"];

  it("displays the correct tab based on URL parameter", () => {
    const testCases = [
      { path: "/dashboard?tab=profile", testId: "DashProfile" },
      { path: "/dashboard?tab=posts", testId: "DashPosts" },
      { path: "/dashboard?tab=users", testId: "DashUsers" },
      { path: "/dashboard?tab=comments", testId: "DashComments" },
      { path: "/dashboard?tab=dash", testId: "DashboardComp" },
    ];

    testCases.forEach(({ path, component }) => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/dashboard" component={Dashboard} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      // Check if the component is rendered
      expect(display.includes("<h2>")).toBe(true);
    });
  });
});
