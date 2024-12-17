import React from 'react';
import { CentroidDefinition } from "../../types/types";
import { formatInteger, formatNumber } from "../../utilities/formatUtilities";
import CentroidName from "../CentroidName";
import CentroidColor from '../CentroidColor';
import ColorSwatch from '../ColorSwatch';

export const formatCentroidDefinition = (
  col: { key: keyof CentroidDefinition; label: string; justify: string, width: string, type: string },
  theDatum: number | string,
  centroidDefinition: CentroidDefinition,
  onUpdateName: (centroidDefinition: CentroidDefinition) => void,
  onUpdateColor: (centroidDefinition: CentroidDefinition) => void,
) => {
    switch (col.key) {
      case 'name': {
        return <CentroidName centroidDefinition={centroidDefinition} onUpdate={onUpdateName} />
      }
      case 'color': {
        return <ColorSwatch centroidDefinition={centroidDefinition} onUpdate={onUpdateColor} />
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
