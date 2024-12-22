"use client";

// material-ui
import { useTheme } from "@mui/material/styles";

import { BarChart } from "@mui/x-charts/BarChart";

// material-ui
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project import
import MainCard from "components/MainCard";
import { lusitana } from "../fonts";

// assets

export type WeeklyData = [
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

function sum(arr: WeeklyData) {
  return arr.reduce((acc, val) => acc + val, 0);
}

// const data = [80, 95, 70, 42, 65, 55, 78];
const xLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function WeeklylyBarChart({ data }: { data: WeeklyData }) {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={380}
      series={[{ data, label: "Series-1" }]}
      xAxis={[
        {
          data: xLabels,
          scaleType: "band",
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: axisFonstyle,
        },
      ]}
      leftAxis={null}
      slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: "none" }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ "& .MuiBarElement-root:hover": { opacity: 0.6 } }}
    />
  );
}

export default function IncomeBarChart({ data }: { data: WeeklyData }) {
  return (
    <div className="w-full">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Average by day of the week
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                Weekly Total
              </Typography>
              <Typography variant="h3">
                ${data.reduce((acc, val) => acc + val, 0)}
              </Typography>
            </Stack>
          </Box>
          <WeeklylyBarChart data={data} />
        </MainCard>
      </div>
    </div>
  );
}
