import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";
import CardWrapper from "@/app/ui/dashboard/cards";
import IncomeAreaChart from "@/app/ui/charts/IncomeAreaChart";
import { dbGetInvoices } from "@/app/lib/db-queries";
import IncomeBarChart, { WeeklyData } from "@/app/ui/charts/IncomeBarChart";
import TransactionHistory from "@/app/ui/charts/TransactionHistory";

function getInvoiceStatsForEachMonth(
  invoices: {
    date: Date;
    amount: number;
    id: string;
    customer_id: string;
    status: string;
  }[]
) {
  const months = new Array(12).fill(0);
  const counts = new Array(12).fill(0);
  invoices.forEach((invoice) => {
    const month = new Date(invoice.date).getMonth();
    months[month] += invoice.amount / 100;
    counts[month] += 1;
  });
  return {
    total: months,
    average: months.map((x, i) => (counts[i] ? x / counts[i] : 0)),
  };
}

function getInvoiceStatsForThisWeek(
  invoices: {
    date: Date;
    amount: number;
    id: string;
    customer_id: string;
    status: string;
  }[]
): WeeklyData {
  const days: WeeklyData = [0, 0, 0, 0, 0, 0, 0];
  const counts = new Array(7).fill(0);
  invoices.forEach((invoice) => {
    const day = new Date(invoice.date).getDay();
    days[day] += invoice.amount / 100;
    counts[day] += 1;
  });
  return days;
}

export default async function Page() {
  const invoices = await dbGetInvoices();
  const data = getInvoiceStatsForEachMonth(invoices);
  console.log({ data });
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper />
          </Suspense>
        </div>
        <div className="mt-6 flex gap-6">
          <Suspense fallback={<RevenueChartSkeleton />}>
            {/* <RevenueChart /> */}
            <IncomeAreaChart data1={data.average} data2={data.total} />
          </Suspense>
          <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestInvoices />
          </Suspense>
        </div>
        <div className="mt-6 flex gap-6">
          <IncomeBarChart data={getInvoiceStatsForThisWeek(invoices)} />
          <TransactionHistory />
        </div>
        <div className="mt-6 flex gap-6">{<RevenueChart />}</div>
      </div>
    </main>
  );
}
