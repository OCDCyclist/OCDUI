import React from "react";
import Link from "@mui/material/Link";

interface DownloadRideDataLinkProps {
  rideid: number;
  text?: string;
}

const DownloadRideDataLink: React.FC<DownloadRideDataLinkProps> = ({
  rideid,
  text,
}) => {
  const handleDownload = async () => {
    if (!rideid || rideid === 0) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/ride/download/${rideid}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ride detail data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `ride_${rideid}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ride data:", error);
    }
  };

  if (!rideid || rideid === 0) {
    return <span>Download data not available</span>;
  }

  return (
    <Link component="button" onClick={handleDownload}>
      {text || "Download ride data"}
    </Link>
  );
};

export default DownloadRideDataLink;
