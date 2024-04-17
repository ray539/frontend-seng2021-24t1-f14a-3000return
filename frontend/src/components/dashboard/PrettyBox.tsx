import { Box, Grid } from "@mui/material";
import React from "react";


export function PrettyBox ({ width, element, colour } : {width: string, element: React.ReactNode, colour: string }) {
  const size = "16px"

  return (
    <>
      <Grid 
        container
        width={width}
        paddingRight={size}
        paddingBottom={size}
      >
        {element}

        <Box
          position={"relative"}
          zIndex={"0"}
          bgcolor={colour}
          width={"100%"}
          height={"100%"}
          marginTop={size}
          left={size}
          bottom={"100%"}
        />
      </Grid>
    </>
  );
}