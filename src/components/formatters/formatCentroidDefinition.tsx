import { CentroidDefinition } from "../../types/types";
import { formatInteger, formatNumber } from "../../utilities/formatUtilities";

export const formatCentroidDefinition = (col: { key: keyof CentroidDefinition; label: string; justify: string, width: string, type: string }, theDatum: number | string) => {
    switch (col.key) {
      case 'name': {
        return theDatum as string;
      }
      case 'ride_count':{
        return formatInteger(theDatum as number);
      }
      case 'startyear':
      case 'endyear':
      case 'cluster':{
        return theDatum as string;
      }
      case 'distance':
      case 'speedavg':
      case 'elevationgain':
      case 'hravg':
      case 'powernormalized':
      default: return formatNumber(theDatum as number);
    }
  };
