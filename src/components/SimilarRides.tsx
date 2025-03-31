import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import RideListComponent from "./RideListComponent";

interface SimilarRidesProps {
  rideid: number;
}

const SimilarRides: React.FC<SimilarRidesProps> = ({ rideid }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)}>
        <Tab label="Route" />
        <Tab label="Effort" />
      </Tabs>
      <Box p={2}>
        {tabIndex === 0 ? (
          <RideListComponent similar_to_rideid={rideid} />
        ) : (
          <RideListComponent similareffort_to_rideid={rideid} />
        )}
      </Box>
    </Box>
  );
};

export default SimilarRides;
