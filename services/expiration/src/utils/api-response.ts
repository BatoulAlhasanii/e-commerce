export type ApiResponse<T> = {
  message: string | null;
  data: T;
};

export const responseSuccess = <T>(message: string | null = null, data: T = null): ApiResponse<T> => {
  return {
    message: message,
    data: data,
  };
};
