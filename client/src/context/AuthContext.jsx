import { createContext, useContext, useEffect, useReducer } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return { user: null, token: null, loading: false };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount, verify token and fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!state.token) {
        dispatch({ type: "STOP_LOADING" });
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        dispatch({ type: "SET_USER", payload: data.user });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };
    fetchUser();
  }, []);

  const login = (data) => dispatch({ type: "LOGIN", payload: data });
  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
