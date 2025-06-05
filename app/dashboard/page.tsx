import { Suspense } from "react";
import { DashboardTabRenderer } from "@/components/dashboard/dashboard-tab-renderer";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Đang tải dashboard...</div>}>
      <DashboardTabRenderer />
    </Suspense>
  );
}
