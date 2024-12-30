import React, { useState } from "react";
import {
  Stack,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import { CentroidDefinition } from "../types/types";

interface ClusterColorPickerProps {
  centroidDefinition: CentroidDefinition,
  onUpdate: (centroidDefinition: CentroidDefinition) => void; // Callback for submit
}

const ClusterColorPicker: React.FC<ClusterColorPickerProps> = ({
  centroidDefinition,
  onUpdate,
}) => {
  // Parse initial colors and names
  const initialColors = centroidDefinition.colors.split(",").map((color) => color.trim());
  const initialNames = centroidDefinition.names.split(",").map((name) => name.trim());

  const [colors, setColors] = useState<string[]>(initialColors);
  const [names, setNames] = useState<string[]>(initialNames);

  // Predefined palette of 16 distinct colors
  const colorPalette = [
    "#FFC0CB", "#FFA07A", "#FF6347", "#FF4500", // Light pink to deep orange
    "#FFD700", "#ADFF2F", "#32CD32", "#008000", // Yellow to greens
    "#00CED1", "#4682B4", "#1E90FF", "#00008B", // Teal to blues
    "#8A2BE2", "#9400D3", "#A52A2A", "#808080", // Purple to dark gray
  ];

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
  };

  const handleNameChange = (index: number, newName: string) => {
    // Validate input: max 15 characters, no commas
    if (newName.length <= 15 && !newName.includes(",")) {
      const updatedNames = [...names];
      updatedNames[index] = newName;
      setNames(updatedNames);
    }
  };

  const handleSubmit = () => {
    onUpdate({
        ...centroidDefinition,
      colors: colors.join(","),
      names: names.join(","),
    });
  };

  const handleCancel = () => {
    setColors(initialColors);
    setNames(initialNames);
  };

  return (
    <Box>
      <Typography variant="h6" component={"span"}>Cluster Color Picker</Typography>
      <Stack spacing={2}>
        {colors.map((color, index) => (
          <Stack key={index} direction="row" spacing={2} alignItems="center">
            {/* Color index */}
            <Typography variant="body1" component={"span"}>Color {index + 1}:</Typography>
            {/* Color swatch */}
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: color,
                border: "1px solid #000",
                borderRadius: "4px",
              }}
            />
            {/* Color selector */}
            <FormControl>
              <Select
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {colorPalette.map((paletteColor) => (
                  <MenuItem key={paletteColor} value={paletteColor}>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        backgroundColor: paletteColor,
                        marginRight: 1,
                        border: "1px solid #000",
                      }}
                    />
                    {paletteColor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Name input */}
            <TextField
              value={names[index]}
              onChange={(e) => handleNameChange(index, e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Name"
              inputProps={{
                maxLength: 15,
              }}
              helperText="Max 15 chars, no commas"
            />
          </Stack>
        ))}
      </Stack>
      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default ClusterColorPicker;
