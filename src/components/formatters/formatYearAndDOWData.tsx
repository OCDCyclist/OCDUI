import { YearAndDOWData } from "../../types/types";
import { formatInteger, formatNumber } from "../../utilities/formatUtilities";

export const formatYearAndDOWData = ( col:  { key: keyof YearAndDOWData; label: string }, theDatum: number) =>{
    switch(col.key){
      case 'elevationgainmonday':
      case 'elevationgaintuesday':
      case 'elevationgainwednesday':
      case 'elevationgainthursday':
      case 'elevationgainfriday':
      case 'elevationgainsaturday':
      case 'elevationgainsunday':
      case 'elevationgain':
      case 'elapsedtimemonday':
      case 'elapsedtimetuesday':
      case 'elapsedtimewednesday':
      case 'elapsedtimethursday':
      case 'elapsedtimefriday':
      case 'elapsedtimesaturday':
      case 'elapsedtimesunday':
      case 'elapsedtime':
      case 'hraveragemonday':
      case 'hraveragetuesday':
      case 'hraveragewednesday':
      case 'hraveragethursday':
      case 'hraveragefriday':
      case 'hraveragesaturday':
      case 'hraveragesunday':
      case 'hraverage':
      case 'poweraveragemonday':
      case 'poweraveragetuesday':
      case 'poweraveragewednesday':
      case 'poweraveragethursday':
      case 'poweraveragefriday':
      case 'poweraveragesaturday':
      case 'poweraveragesunday':
      case 'poweraverage':{
        return formatInteger(theDatum);
      }
      case 'distancemonday':
      case 'distancetuesday':
      case 'distancewednesday':
      case 'distancethursday':
      case 'distancefriday':
      case 'distancesaturday':
      case 'distancesunday':
      case 'distance':{
        return formatNumber(theDatum);
      }
      case 'year':{
        return theDatum;
      }

      default: return formatNumber(theDatum);
    }
}
