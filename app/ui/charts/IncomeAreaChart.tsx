"use client";
import { useState } from "react";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { LineChart } from "@mui/x-charts/LineChart";
import { lusitana } from "../fonts";
// import { ThemeMode } from 'config';

// Sample data
const monthlyLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthlyData1 = [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35];
const weeklyData1 = [31, 40, 28, 51, 42, 109, 100];

const monthlyData2 = [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41];
const weeklyData2 = [11, 32, 45, 32, 34, 52, 41];

interface ItemProps {
  label: string;
  visible: boolean;
  color: string;
}

interface Props {
  data1: number[];
  data2: number[];
}

function Legend({
  items,
  onToggle,
}: {
  items: ItemProps[];
  onToggle: (label: string) => void;
}) {
  // const theme = useTheme();
  // const legendText = "common.white";

  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "black",
            borderRadius: 1,
            p: 1,
            justifyContent: "center",
          }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: item.visible ? item.color : "grey.500",
              borderRadius: "50%",
              mr: 1,
            }}
          />
          <Typography variant="body2" color={"#000"}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ data1, data2 }: Props) {
  const theme = useTheme();

  const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({
    "Average invoice": true,
    "Total invoice": true,
  });

  const labels = monthlyLabels;
  // const labels = slot === 'monthly' ? monthlyLabels : weeklyLabels;
  // const data1 = slot === 'monthly' ? monthlyData1 : weeklyData1;
  // const data2 = slot === 'monthly' ? monthlyData2 : weeklyData2;

  const line = theme.palette.divider;

  const toggleVisibility = (label: string) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: data1,
      label: "Average invoice",
      showMark: false,
      area: true,
      id: "Germany",
      color: theme.palette.primary.main || "",
      visible: visibility["Average invoice"],
    },
    {
      data: data2,
      label: "Total invoice",
      showMark: false,
      area: true,
      id: "UK",
      color: theme.palette.primary.light || "",
      visible: visibility["Total invoice"],
    },
  ];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <div className="w-full">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Total invoices by month
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <LineChart
          grid={{ horizontal: true }}
          xAxis={[
            {
              scaleType: "point",
              data: labels,
              disableLine: true,
              tickLabelStyle: axisFonstyle,
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: axisFonstyle,
            },
          ]}
          height={450}
          margin={{ top: 40, bottom: 20, right: 20 }}
          series={visibleSeries
            .filter((series) => series.visible)
            .map((series) => ({
              type: "line",
              data: series.data,
              label: series.label,
              showMark: series.showMark,
              area: series.area,
              id: series.id,
              color: series.color,
              stroke: series.color,
              strokeWidth: 2,
            }))}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            "& .MuiAreaElement-series-Germany": {
              fill: "url('#myGradient1')",
              strokeWidth: 2,
              opacity: 0.8,
            },
            "& .MuiAreaElement-series-UK": {
              fill: "url('#myGradient2')",
              strokeWidth: 2,
              opacity: 0.8,
            },
            "& .MuiChartsAxis-directionX .MuiChartsAxis-tick": { stroke: line },
          }}
        >
          <defs>
            <linearGradient id="myGradient1" gradientTransform="rotate(90)">
              <stop
                offset="10%"
                stopColor={alpha(theme.palette.primary.main, 0.4)}
              />
              <stop
                offset="90%"
                stopColor={alpha(theme.palette.background.default, 0.4)}
              />
            </linearGradient>
            <linearGradient id="myGradient2" gradientTransform="rotate(90)">
              <stop
                offset="10%"
                stopColor={alpha(theme.palette.primary.light, 0.4)}
              />
              <stop
                offset="90%"
                stopColor={alpha(theme.palette.background.default, 0.4)}
              />
            </linearGradient>
          </defs>
        </LineChart>
        <Legend items={visibleSeries} onToggle={toggleVisibility} />
      </div>
    </div>
  );
}
