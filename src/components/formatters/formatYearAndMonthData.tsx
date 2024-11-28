import { YearAndMonthData } from "../../types/types";
import { formatInteger, formatNumber1 } from "../../utilities/formatUtilities";

export const formatYearAndMonthData = ( col:  { key: keyof YearAndMonthData; label: string }, theDatum: string | number) =>{
    switch(col.key){
      case 'jan_elevationgain':
      case 'feb_elevationgain':
      case 'mar_elevationgain':
      case 'apr_elevationgain':
      case 'may_elevationgain':
      case 'jun_elevationgain':
      case 'jul_elevationgain':
      case 'aug_elevationgain':
      case 'sep_elevationgain':
      case 'oct_elevationgain':
      case 'nov_elevationgain':
      case 'dec_elevationgain':
      case 'elapsedtime_hours':
      case 'jan_elapsedtime_hours':
      case 'feb_elapsedtime_hours':
      case 'mar_elapsedtime_hours':
      case 'apr_elapsedtime_hours':
      case 'may_elapsedtime_hours':
      case 'jun_elapsedtime_hours':
      case 'jul_elapsedtime_hours':
      case 'aug_elapsedtime_hours':
      case 'sep_elapsedtime_hours':
      case 'oct_elapsedtime_hours':
      case 'nov_elapsedtime_hours':
      case 'dec_elapsedtime_hours':{
        return formatInteger(Number(theDatum));
      }
      case 'jan_distance':
      case 'feb_distance':
      case 'mar_distance':
      case 'apr_distance':
      case 'may_distance':
      case 'jun_distance':
      case 'jul_distance':
      case 'aug_distance':
      case 'sep_distance':
      case 'oct_distance':
      case 'nov_distance':
      case 'dec_distance':
      {
        return formatNumber1(theDatum);
      }
      case 'rideyear':{
        return theDatum;
      }
      default: return formatNumber1(theDatum);
    }
}
