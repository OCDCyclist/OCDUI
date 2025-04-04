import React from 'react';
import Link from '@mui/material/Link';

interface StravaRideLinkProps {
  stravaRideId: number;
  text?: string;
}

const StravaRideLink: React.FC<StravaRideLinkProps> = ({ stravaRideId, text }) => {
  if( !stravaRideId || stravaRideId === 0 ){
    return "Not available in Strava"
  }
  return (
    <Link
      target="_blank"
      rel="noopener"
      href={`https://www.strava.com/activities/${stravaRideId}`}
    >
      {!text ? "Open in Strava" : text }
    </Link>
  );
};

export default StravaRideLink;
