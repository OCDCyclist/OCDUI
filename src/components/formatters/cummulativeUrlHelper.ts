import { FormatDateParams } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function cummulativeUrlHelper({years }: FormatDateParams = {}): string {
  let url = `${API_BASE_URL}/ocds/cummulatives`;

  if(Array.isArray(years)){
    url = `${API_BASE_URL}/ocds/cummulatives?years=` + years.join(',');
  }

  return url;
};
