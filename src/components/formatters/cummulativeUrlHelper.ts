import { FormatDateParams } from "../../types/types";

export function cummulativeUrlHelper({years }: FormatDateParams = {}): string {
  let url = 'http://localhost:3000/ocds/cummulatives';

  if(Array.isArray(years)){
    url = 'http://localhost:3000/ocds/cummulatives?years=' + years.join(',');
  }

  return url;
};
