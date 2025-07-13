import { FormatDateParams } from "../../types/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function rideUrlHelper({ date, year, month, dow, dom, cluster, years, start_date, end_date, similar_to_rideid, similareffort_to_rideid, trainer }: FormatDateParams = {}): string {
  let url = `${API_BASE_URL}/ride/rides/lastmonth`;

  if(typeof date !== 'undefined'){
    url = `${API_BASE_URL}/ride/ridesByDate?date=${date}`;
  }
  else if(typeof cluster !== 'undefined'){
    url = `${API_BASE_URL}/cluster/getRidesByCluster?clusterId=${cluster?.clusterid}&cluster=${cluster.cluster}`;
  }
  else if(typeof year !== 'undefined' && typeof month !== 'undefined'){
    url = `${API_BASE_URL}/ride/ridesByYearMonth?year=${year}&month=${month}`;
  }
  else if(typeof year !== 'undefined' && typeof dow !== 'undefined'){
    url = `${API_BASE_URL}/ride/ridesByYearDOW?year=${year}&dow=${dow}`;
  }
  else if(typeof dom !== 'undefined' && typeof month !== 'undefined'){
    url = `${API_BASE_URL}/ride/getRidesByDOMMonth?dom=${dom}&month=${month}`;
  }
  else if(Array.isArray(years)){
    url = `${API_BASE_URL}/ride/rides/years?years=` + years.join(',');
  }
  else if(typeof start_date !== 'undefined' && typeof end_date !== 'undefined'){
    url = `${API_BASE_URL}/ride/getRidesByDateRange?startDate=${start_date}&endDate=${end_date}`;
  }
  else if(typeof similar_to_rideid !== 'undefined'){
    url = `${API_BASE_URL}/ride/getSimilarRides/route/${similar_to_rideid}`;
  }
  else if(typeof similareffort_to_rideid !== 'undefined'){
    url = `${API_BASE_URL}/ride/getSimilarRides/effort/${similareffort_to_rideid}`;
  }
  else if(typeof trainer !== 'undefined'){
    url = `${API_BASE_URL}/ride/ridesByYearTrainer?year=${year}&trainer=${trainer}`;
  }

  return url;
};
