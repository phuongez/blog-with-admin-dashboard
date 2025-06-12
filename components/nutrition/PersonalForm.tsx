"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { parse } from "path";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";

// Types

type FormData = {
  gender: "male" | "female";
  weight: number;
  height: number;
  age: number;
  bodyfat: number;
  activity: number;
  goal: "maintain" | "lose" | "gain";
};

type Result = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

export default function PersonalForm({
  onCalculate,
}: {
  onCalculate: (data: Result) => void;
}) {
  const { user } = useUser();

  const [form, setForm] = useState<FormData>({
    gender: "male",
    weight: 60,
    height: 170,
    age: 25,
    bodyfat: 15,
    activity: 1.375,
    goal: "maintain",
  });

  const [bfCalculator, setBfCalculator] = useState(false);
  const [waist, setWaist] = useState(0);
  const [hip, setHip] = useState(0);
  const [neck, setNeck] = useState(0);
  const [navyBfp, setNavyBfp] = useState(0);
  const [showBfImg, setShowBfImg] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [numberOfWorkouts, setNumberOfWorkouts] = useState(3);
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [proteinRatio, setProteinRatio] = useState(1.8);
  const [fatPercentage, setFatPercentage] = useState(0.3);
  const [showResult, setShowResult] = useState(false);
  const [proteinIntake, setProteinIntake] = useState(0);
  const [fatIntake, setFatIntake] = useState(0);
  const [carbIntake, setCarbIntake] = useState(0);
  const caloriesIntake = proteinIntake * 4 + fatIntake * 9 + carbIntake * 4;

  // Load last saved profile if exists
  useEffect(() => {
    const fetchLastProfile = async () => {
      if (!user?.id) return;
      const res = await fetch(`/api/user/load-last-profile?userId=${user.id}`);
      const data = await res.json();
      if (data?.profile) {
        const { gender, weight, height, age, bodyfat, activity, goal } =
          data.profile;
        setForm((prev) => ({
          ...prev,
          gender,
          weight,
          height,
          age,
          bodyfat,
          activity,
          goal,
        }));
      }
    };
    fetchLastProfile();
  }, [user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "weight" || name === "height" || name === "age"
          ? parseInt(value)
          : name === "activity" || name === "bodyfat"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { weight, height, bodyfat, activity, goal } = form;

    const fatMass = weight * (bodyfat / 100);
    const fatFreeMass = weight - fatMass;
    const bmr = 370 + 21.6 * fatFreeMass;
    const restDayTdee = bmr * activity * 1.1;
    const workoutBurn = 0.1 * workoutDuration * weight;
    const workoutDayTdee = restDayTdee + workoutBurn;
    const averageTdee =
      (workoutDayTdee * numberOfWorkouts +
        restDayTdee * (7 - numberOfWorkouts)) /
      7; // mặc định 3 buổi tập

    let calories = averageTdee;
    if (goal === "lose") calories *= 0.8;
    if (goal === "gain") calories *= 1.1;

    setProteinIntake(weight * proteinRatio);
    setFatIntake((calories * fatPercentage) / 9);
    setCarbIntake((calories - proteinIntake * 4 - fatIntake * 9) / 4);

    // Hiển thị kết quả tính toán
    setShowResult(true);

    onCalculate({
      bmr: Math.round(bmr),
      tdee: Math.round(averageTdee),
      calories: Math.round(calories),
      protein: Math.round(proteinIntake),
      fat: Math.round(fatIntake),
      carb: Math.round(carbIntake),
    });

    if (saveInfo && user?.id) {
      await fetch("/api/user/save-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });
    }
  };

  function calculateBodyFat(
    gender: string,
    waist: number,
    hip: number,
    neck: number,
    height: number
  ): void {
    if (gender === "male") {
      const bodyFat =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waist - neck) +
            0.15456 * Math.log10(height)) -
        450;
      setNavyBfp(Math.round(bodyFat * 10) / 10);
    } else if (gender === "female") {
      const bodyFat =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waist + hip - neck) +
            0.221 * Math.log10(height)) -
        450;
      setNavyBfp(Math.round(bodyFat * 10) / 10);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground text-center md:text-left">
            Nutrition Calculator
          </CardTitle>
          <p className="text-muted-foreground text-center md:text-left">
            Nhập các chỉ số và mục tiêu mong muốn để xác định kế hoạch dinh
            dưỡng
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Gender div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="gender" className="mr-2 w-[7rem]">
                Giới tính
              </Label>
              <select
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
            {/* Age div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="age" className="mr-2 w-[7rem]">
                Tuổi
              </Label>
              <Input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="Tuổi"
                className="w-auto flex-1"
              />
            </div>
            {/* Weight div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="weight" className="mr-2 w-[7rem]">
                Cân nặng (kg)
              </Label>
              <Input
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                placeholder="Cân nặng (kg)"
                className="w-auto flex-1"
              />
            </div>
            {/* Height div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="height" className="mr-2 w-[7rem]">
                Chiều cao (cm)
              </Label>
              <Input
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                placeholder="Chiều cao (cm)"
                className="w-auto flex-1"
              />
            </div>
            {/* Bodyfat percentage div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="bodyfat" className="mr-2 w-[7rem]">
                Tỷ lệ mỡ (%)
              </Label>
              <Input
                name="bodyfat"
                type="number"
                value={form.bodyfat}
                onChange={handleChange}
                placeholder="Tỷ lệ % mỡ cơ thể"
                className="w-auto flex-1"
              />
            </div>
            {/* Bodyfat calculator div */}
            <div className="mt-6">
              <div className="flex my-2 items-center">
                <Label htmlFor="bfcalc" className="mr-2 w-fit italic">
                  Công thức xác định tỷ lệ mỡ
                </Label>
                <input
                  name="bfcalc"
                  type="checkbox"
                  checked={bfCalculator}
                  onChange={(e) => setBfCalculator(e.target.checked)}
                />
              </div>
              {bfCalculator && (
                <div className="mb-6">
                  <div className="flex gap-2 items-center mb-4">
                    <Label htmlFor="waist" className="mr-2 w-[10rem]">
                      Số đo eo tại rốn (cm)
                    </Label>
                    <Input
                      name="waist"
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(parseFloat(e.target.value))}
                      placeholder="Số đo vòng eo"
                      className="w-auto flex-1"
                    />
                  </div>
                  <div className="flex gap-2 items-center mb-4">
                    <Label htmlFor="hip" className="mr-2 w-[10rem]">
                      Số đo mông (cm)
                    </Label>
                    <Input
                      name="waist"
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(parseFloat(e.target.value))}
                      placeholder="Số đo vòng mông"
                      className="w-auto flex-1"
                    />
                  </div>
                  <div className="flex gap-2 items-center mb-4">
                    <Label htmlFor="neck" className="mr-2 w-[10rem]">
                      Số đo cổ (cm)
                    </Label>
                    <Input
                      name="neck"
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(parseFloat(e.target.value))}
                      placeholder="Số đo vòng cổ"
                      className="w-auto flex-1"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() =>
                        calculateBodyFat(
                          form.gender,
                          waist,
                          hip,
                          neck,
                          form.height
                        )
                      }
                      size={"sm"}
                      className="mb-4"
                    >
                      Tính tỷ lệ mỡ
                    </Button>
                    <p>Tỷ lệ mỡ cơ thể theo công thức Navy: {navyBfp}%</p>
                  </div>
                </div>
              )}
            </div>
            {/* Bodyfat image div */}
            <div className="mt-2">
              <div className="flex my-2 items-center">
                <Label htmlFor="bfimage" className="mr-2 w-fit italic">
                  Ảnh tham khảo các mức tỷ lệ mỡ
                </Label>
                <input
                  name="bfimage"
                  type="checkbox"
                  checked={showBfImg}
                  onChange={(e) => setShowBfImg(e.target.checked)}
                />
              </div>
              {showBfImg && (
                <div className="mb-6">
                  {form.gender === "female" ? (
                    <div className="w-full relative">
                      <h2 className="py-2">Tỷ lệ tham khảo ở nữ giới</h2>
                      <Image
                        src="https://res.cloudinary.com/ds30pv4oa/image/upload/v1749566498/5b98fe3c-d51b-4861-95f0-9868e4e8f4fa.png"
                        alt="female percentage"
                        width={0} // Không ép chiều rộng cố định
                        height={0} // Không ép chiều cao cố định
                        sizes="100vw" // Dành cho responsive
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full relative">
                      <h2 className="py-2">Tỷ lệ tham khảo ở nam giới</h2>
                      <Image
                        src="https://res.cloudinary.com/ds30pv4oa/image/upload/v1749566574/abb2ad2f-6bf5-475e-89bf-c524851d5844.png"
                        alt="male percentage"
                        width={0} // Không ép chiều rộng cố định
                        height={0} // Không ép chiều cao cố định
                        sizes="100vw" // Dành cho responsive
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity factor div */}
            <div className="flex my-2 items-center mt-6">
              <Label htmlFor="gender" className="mr-2 w-[10rem]">
                Mức vận động
              </Label>
              <select
                name="activity"
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={form.activity}
                onChange={handleChange}
              >
                <option value="1.2">Ít vận động</option>
                <option value="1.375">Vận động nhẹ</option>
                <option value="1.55">Vận động trung bình</option>
                <option value="1.725">Vận động nhiều</option>
              </select>
            </div>
            <p className="text-red-700 text-sm">
              Nếu bạn dành nhiều thời gian trong ngày ngồi tại chỗ và có tập
              luyện tại phòng gym sẽ ở mức vận động nhẹ
            </p>
            {/* Goal div */}
            <div className="flex my-2 items-center mt-6">
              <Label htmlFor="gender" className="mr-2 w-[10rem] leading-6">
                Mục tiêu của bạn là
              </Label>
              <select
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                name="goal"
                value={form.goal}
                onChange={handleChange}
              >
                <option value="maintain">Giữ cân</option>
                <option value="lose">Giảm cân chậm</option>
                <option value="gain">Tăng cân chậm</option>
              </select>
            </div>
            {/* Workout Info div */}
            {/* Activity factor div */}
            <div className="flex my-2 items-center">
              <Label htmlFor="workoutDay" className="mr-2 w-[10rem]">
                Số buổi tập một tuần
              </Label>
              <select
                name="workoutDay"
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={numberOfWorkouts}
                onChange={(e) => setNumberOfWorkouts(parseInt(e.target.value))}
              >
                <option value="2">2 buổi</option>
                <option value="3">3 buổi</option>
                <option value="4">4 buổi</option>
                <option value="5">5 buổi</option>
                <option value="6">6 buổi</option>
              </select>
            </div>
            <div className="flex my-2 items-center">
              <Label htmlFor="workoutDuration" className="mr-2 w-[10rem]">
                Thời gian tập mỗi buổi (phút)
              </Label>
              <Input
                type="number"
                name="workoutDuration"
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-auto flex-1"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
              ></Input>
            </div>
            {/* Protein & Fat intake */}
            <div className="flex my-2 items-center">
              <Label htmlFor="proteinRatio" className="mr-2 w-[10rem]">
                Mức protein
              </Label>
              <select
                name="proteinRatio"
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={proteinRatio}
                onChange={(e) => setProteinRatio(parseFloat(e.target.value))}
              >
                <option value="1.4">1.4 g protein/kg cân nặng</option>
                <option value="1.5">1.5 g protein/kg cân nặng</option>
                <option value="1.6">1.6 g protein/kg cân nặng</option>
                <option value="1.7">1.7 g protein/kg cân nặng</option>
                <option value="1.8">1.8 g protein/kg cân nặng</option>
              </select>
            </div>
            <div className="flex my-2 items-center">
              <Label htmlFor="fatPercentage" className="mr-2 w-[10rem]">
                Mức fat
              </Label>
              <select
                name="fatPercentage"
                className=" h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={fatPercentage}
                onChange={(e) => setFatPercentage(parseFloat(e.target.value))}
              >
                <option value="0.25">25% tổng năng lượng</option>
                <option value="0.3">30% tổng năng lượng</option>
                <option value="0.35">35% tổng năng lượng</option>
                <option value="0.4">40% tổng năng lượng</option>
                <option value="0.45">45% tổng năng lượng</option>
                <option value="0.5">50% tổng năng lượng</option>
              </select>
            </div>

            <div className="flex my-2 items-center">
              <Label className="mr-2 w-fit italic">
                Lưu thông tin vào lịch sử
              </Label>
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className=""
              />
            </div>

            {showResult && (
              <div className="mt-6">
                <h2 className="font-bold">Thông số dinh dưỡng đề xuất</h2>
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className=" text-black w-1/4 dark:text-white">
                        Protein
                      </TableHead>
                      <TableHead className=" text-black w-1/4 dark:text-white">
                        Carb
                      </TableHead>
                      <TableHead className=" text-black w-1/4 dark:text-white">
                        Fat
                      </TableHead>
                      <TableHead className=" text-black w-1/4 dark:text-white">
                        Calories
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{proteinIntake}</TableCell>
                      <TableCell>{Math.round(carbIntake)}</TableCell>
                      <TableCell>{Math.round(fatIntake)}</TableCell>
                      <TableCell>{Math.round(caloriesIntake)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            <Button className="mt-6 block" type="submit">
              Tính toán
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
