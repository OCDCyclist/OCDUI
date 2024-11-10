import { RideData } from "../types/types";

export function formatElapsedTime(seconds: number): string {
    const pad = (num: number) => num.toString().padStart(2, '0');

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const datePart = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date);

    const weekdayPart = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
    }).format(date);

    return `${datePart} ${weekdayPart}`;
  };

export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: true,
    }).format(Number(num));
};

export const formatPercent = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: true,
    }).format(100 * Number(num));
};

export const formatInteger = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true,
    }).format(Number(num));
};

export const formatBoolean = (num: number) => {
    return num === 0 ? 'false' : 'true';
};

export const isTextPresent = (str: string) =>{
    if( typeof(str) !== 'string') return false;
    return str.trim().length === 0 ? false : true;
}

export const formatNumber1 = (num: string | number) => {
return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: true,
}).format(Number(num));
};

export const formatRideData = (col: { key: keyof RideData; label: string; justify: string, width: string }, theDatum: number | string) => {
    switch (col.key) {
      case 'title':
      case 'comment':{
        return theDatum as string;
      }
      case 'rideid':
      case 'cadence':
      case 'hravg':
      case 'hrmax':
      case 'poweravg':
      case 'powermax':
      case 'bikeid':
      case 'stravaid':
      case 'elevationgain':
      case 'powernormalized':
      case 'tss':
      case 'matches':
      case 'trainer':
      case 'elevationloss': {
        return formatInteger(theDatum as number);
      }
      case 'elapsedtime': {
        return formatElapsedTime(theDatum as number);
      }
      case 'date': return formatDate(theDatum as string);
      case 'distance':
      case 'speedavg':
      case 'speedmax':
      case 'intensityfactor':
      case 'fracdim':
      default: return formatNumber(theDatum as number);
    }
  };
