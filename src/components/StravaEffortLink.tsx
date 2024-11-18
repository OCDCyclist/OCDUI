import React from 'react';
import Link from '@mui/material/Link';

interface StravaEffortLinkProps {
  stravaRideId: number;
  stravaEffortId: number;
  text?: string;
}

const StravaEffortLink: React.FC<StravaEffortLinkProps> = ({ stravaRideId, stravaEffortId, text }) => {
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
