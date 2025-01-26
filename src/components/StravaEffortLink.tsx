import React from 'react';
import Link from '@mui/material/Link';

interface StravaEffortLinkProps {
  stravaRideId: number;
  stravaEffortId: number;
  text?: string;
}

const StravaEffortLink: React.FC<StravaEffortLinkProps> = ({ stravaRideId, stravaEffortId, text }) => {
  if( !stravaRideId || stravaRideId === 0 ){
    return "Not available in Strava"
  }

  return (
    <Link
      target="_blank"
      rel="noopener"
      href={`https://www.strava.com/activities/${stravaRideId}/segments/${stravaEffortId}`}
    >
      {!text ? "Open in Strava" : text }
    </Link>
  );
};

export default StravaEffortLink;
