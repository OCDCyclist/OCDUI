import { FormatDateParams } from "../../types/types";

export function rideUrlHelper({ date, year, month, dow, dom, cluster, years, start_date, end_date }: FormatDateParams = {}): string {
  let url = 'http://localhost:3000/ride/rides/lastmonth';

  if(typeof date !== 'undefined'){
    url = `http://localhost:3000/ride/ridesByDate?date=${date}`;
  }
  else if(typeof cluster !== 'undefined'){
    url = `http://localhost:3000/cluster/getRidesByCluster?startYear=${cluster?.startyear}&endYear=${cluster.endyear}&cluster=${cluster.cluster}`;
  }
  else if(typeof year !== 'undefined' && typeof month !== 'undefined'){
    url = `http://localhost:3000/ride/ridesByYearMonth?year=${year}&month=${month}`;
  }
  else if(typeof year !== 'undefined' && typeof dow !== 'undefined'){
    url = `http://localhost:3000/ride/ridesByYearDOW?year=${year}&dow=${dow}`;
  }
  else if(typeof dom !== 'undefined' && typeof month !== 'undefined'){
    url = `http://localhost:3000/ride/getRidesByDOMMonth?dom=${dom}&month=${month}`;
  }
  else if(Array.isArray(years)){
    url = 'http://localhost:3000/ride/rides/years?years=' + years.join(',');
  }
  else if(typeof start_date !== 'undefined' && typeof end_date !== 'undefined'){
    url = `http://localhost:3000/ride/getRidesByDateRange?startDate=${start_date}&endDate=${end_date}`;
  }

  return url;
};
