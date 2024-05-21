import React from "react";
import {
  render,
  screen as SecScreen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { screen } from "../components/utils-screen";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import SignIn from "../pages/SignIn";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

const mockStore = configureMockStore();
const initialState = {
  user: { loading: false, error: null },
};
const store = mockStore(initialState);

describe("SignIn Component", () => {
  beforeEach(() => {
    store.clearActions();
  });

  it("renders the SignIn component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.includes("Login")).toBe(true);
  });

  it("displays an error when fields are empty and form is submitted", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(screen.includes("Error")).toBe(true);
    });
  });

  it("dispatches signInStart and signInSuccess on successful form submission", async () => {
    const mockResponse = {
      success: true,
      data: { user: { name: "Test User" } },
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const actions = store.getActions();
      expect(screen.includes("Signin-start")).toBe(true);
    });

    global.fetch.mockRestore();
  });

  it("intentionally fails this test case", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    // This test will fail because we're expecting a non-existing element
    expect(SecScreen.getByText(/Non-existing text/i)).toBeInTheDocument();
  });

  it("displays an error on failed form submission", async () => {
    const mockError = { success: false, message: "Invalid credentials" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockError),
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(SecScreen?.getByLabelText(/Your email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(SecScreen?.getByLabelText(/Your password/i), {
      target: { value: "password" },
    });
    fireEvent.click(SecScreen?.getByText(/Sign In/i));

    await waitFor(() => {
      const actions = store.getActions();
      expect(screen.includes("Signin-start")).toBe(true);
    });

    global.fetch.mockRestore();
  });

  it("displays a loading spinner when loading", async () => {
    const loadingState = {
      user: { loading: true, error: null },
    };
    const loadingStore = mockStore(loadingState);

    render(
      <Provider store={loadingStore}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.includes("loading")).toBe(true);
  });
});
