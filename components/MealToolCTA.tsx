"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // dùng nếu bạn có sẵn UI button
// hoặc dùng <button> nếu không dùng UI lib

export default function MealToolCTA() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-6 md:p-10 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
      {/* Nội dung */}
      <div className="flex-1 text-center md:text-left space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">
          Bạn có muốn sử dụng công cụ lên thực đơn tự động?
        </h2>
        <p className="text-gray-700 text-md md:text-lg">
          Tính toán lượng calo, macros theo mục tiêu tăng cơ và giảm mỡ. Đặc
          biệt nhanh chóng với sự trợ giúp từ AI.
        </p>

        <Button
          className="mt-4 text-white px-6 py-4 text-lg rounded-md"
          onClick={() => router.push("/nutrition")}
        >
          Truy cập công cụ
        </Button>
      </div>

      {/* Hình minh hoạ */}
      <div className="w-full md:w-[300px]">
        <Image
          src="/demo-tool.png"
          alt="Meal planning tool"
          width={300}
          height={200}
          className="object-contain mx-auto"
        />
      </div>
    </div>
  );
}
