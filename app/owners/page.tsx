"use client";

import DashboardLineChart from "@/components/charts/line-chart";
import HotItemsPieChart from "@/components/charts/hot-items-pie-chart";
import NewCustomers from "@/components/new-customers-table/new-customers";
import TopWorkspaceTable from "@/components/table/top-workspace-table";
import { topWorkspace } from "@/constants/constant";
import { topWorkspaceTableColumns } from "@/constants/table-columns";
import {
  PiggyBank,
  ShoppingBasket,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import CustomerAnalysisChart from "@/components/charts/customer-analysis-chart";

// import Loader from "@/components/loader/Loader";

export default function OwnerPage() {
  // const [loading, setLoading] = useState(true);

  // if (loading) {
  //   return (
  //     <div className="text-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  const date = new Date();
  const dateString = `T${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white grid gap-4 md:grid-cols-4 p-4">
          <div className="col-span-1 flex items-center justify-center bg-[#27D095] rounded-xl text-white">
            <PiggyBank size={36} />
          </div>
          <div className="col-span-2 flex flex-col items-start justify-start gap-2">
            <p className="font-bold">Doanh thu</p>
            <p className="text-[#6F757E] text-xl">$230,22</p>
            <div className="flex gap-1 items-center justify-start text-[#FF8E29] text-sm">
              <TrendingUp /> <span>+55% tháng trước</span>
            </div>
          </div>
          <div className="col-span-1 text-sm flex items-center justify-center text-[#6F757E] font-bold">
            <p>{dateString}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white grid gap-4 md:grid-cols-4 p-4">
          <div className="col-span-1 flex items-center justify-center bg-[#67CADF] rounded-xl text-white">
            <UsersRound size={36} />
          </div>
          <div className="col-span-2 flex flex-col items-start justify-start gap-2">
            <p className="font-bold">Khách hàng</p>
            <p className="text-[#6F757E] text-xl">3.200</p>
            <div className="flex gap-1 items-center justify-start text-[#FF8E29] text-sm">
              <TrendingUp /> <span>+12% tháng trước</span>
            </div>
          </div>
          <div className="col-span-1 text-sm flex items-center justify-center text-[#6F757E] font-bold">
            <p>{dateString}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white grid gap-4 md:grid-cols-4 p-4">
          <div className="col-span-1 flex items-center justify-center bg-[#F54F5F] rounded-xl text-white">
            <ShoppingBasket size={36} />
          </div>
          <div className="col-span-2 flex flex-col items-start justify-start gap-2">
            <p className="font-bold">Số lượng sản phẩm</p>
            <p className="text-[#6F757E] text-xl">1.125</p>
            <div className="flex gap-1 items-center justify-start text-[#FF8E29] text-sm">
              <TrendingUp /> <span>+5% tháng trước</span>
            </div>
          </div>
          <div className="col-span-1 text-sm flex items-center justify-center text-[#6F757E] font-bold">
            <p>{dateString}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <DashboardLineChart />
        </div>
        <div className="col-span-1">
          <HotItemsPieChart />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2 bg-white p-4 rounded-xl">
          <TopWorkspaceTable
            columns={topWorkspaceTableColumns}
            data={topWorkspace}
          />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <NewCustomers />
          <CustomerAnalysisChart />
        </div>
      </div>
    </div>
  );
}
