import { ClusterDefinition } from "../../types/types";
import { formatInteger, formatNumber } from "../../utilities/formatUtilities";

export const formatClusterDefinition = (col: { key: keyof ClusterDefinition; label: string; justify: string, width: string, type: string }, theDatum: number | string | boolean) => {
    switch (col.key) {
      case 'active':{
        return theDatum ? 'Active' : 'Not Active';
      }
      case 'fields': {
        return theDatum as string;
      }
      case 'clusterid':
      case 'clustercount':{
        return formatInteger(theDatum as number);
      }
      case 'startyear':
      case 'endyear':{
        return theDatum as string;
      }
      default: return formatNumber(theDatum as number);
    }
  };
