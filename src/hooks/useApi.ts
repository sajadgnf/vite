import { AxiosError } from "axios";
import { useState } from "react";
import { ApiErrorResponse, ApiState } from "../types";

const initialState = <T>() => ({
  data: null as T | null,
  loading: false,
  error: null as string | null,
});

const useApi = <T, P = unknown>(apiMethod: (...args: P[]) => Promise<T>) => {
  const [state, setState] = useState<ApiState<T>>(initialState<T>());

  const triggerApiCall = async (...params: P[]) => {
    setState({ ...initialState(), loading: true });
    try {
      const data = await apiMethod(...params);
      setState({ ...initialState(), data });
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      setState({
        ...initialState(),
        error:
          err.response?.data?.message ||
          "Request failed. Please try again later.",
      });
    }
  };

  return { ...state, triggerApiCall };
};

export default useApi;
