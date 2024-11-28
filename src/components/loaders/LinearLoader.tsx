import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

interface LoadingProps {
  message?: string;
}

const LinearLoader: React.FC<LoadingProps> = ({ message }) => {
  return (
    <Box
      sx={{
        width: "100%",
        textAlign: "center",
        margin: "20px 0",
      }}
    >
      {message && (
        <Typography
          variant="body2"
          sx={{
            marginBottom: 1,
          }}
        >
          {message}
        </Typography>
      )}
      <LinearProgress />
    </Box>
  );
};

export default LinearLoader;
