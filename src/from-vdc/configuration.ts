// @ts-ignore
const { apiUrl } = window["runConfig"];

export const getApiBaseUrl = (): string => {
  return apiUrl;
};

export const getIdleTimeout = (): number => {
  return 1000 * 60 * 10; // 10 minutes
};

