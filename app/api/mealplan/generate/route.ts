// /app/api/mealplan/generate/route.ts

import { NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair";

export async function POST(req: Request) {
  try {
    const { target, preferences } = await req.json();

    const { calories, protein, carb, fat } = target;
    const meals = preferences?.meals || 3;
    const diet = preferences?.diet || "Bình thường";

    if (!target) {
      return NextResponse.json(
        { error: "Thiếu thông tin target hoặc preferences" },
        { status: 400 }
      );
    }

    const prompt = `
Bạn là chuyên gia dinh dưỡng thể hình. Dựa trên kiến thức chuyên sâu từ The Renaissance Diet 2.0, hãy xây dựng thực đơn trong ngày gồm ${meals} bữa, phù hợp với mục tiêu dinh dưỡng:

- Tổng năng lượng: ${calories} kcal
- Protein: ${protein}g
- Carbohydrate: ${carb}g
- Fat: ${fat}g

Hãy lưu ý người dùng thường tập luyện vào lúc ${preferences.workoutHour} giờ.

Chế độ ăn: ${diet}. Ưu tiên chất lượng thực phẩm cao (chậm tiêu hoá, nhiều chất xơ, ít đường nhanh). Mỗi bữa ăn nên có ít nhất 2–3 món, và:
- Phân phối protein đều giữa các bữa
- Carb tập trung quanh thời gian tập luyện (bữa trước và sau tập nếu biết)
- Fat nên ít trong bữa gần thời gian tập, cao hơn ở bữa xa thời gian tập (ví dụ bữa tối)
- Kèm thêm lời khuyên chế biến (note) đơn giản

Chỉ trả về JSON hợp lệ. Không thêm chú thích, markdown, hoặc văn bản ngoài JSON.

Trả về JSON theo mẫu:
[
  {
    "meal": "Bữa sáng",
    "items": [
      { "food": "Ức gà nướng", "quantity": 150 },
      { "food": "Gạo lứt", "quantity": 100 }
    ],
    "note": "Ức gà nướng cùng tiêu, gạo lứt luộc mềm.",
    "macros": {...}
  },
  ...
]
`.trim();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gemini API error" },
        { status: res.status }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON từ text trả về
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Phản hồi AI không đúng định dạng JSON" },
        { status: 500 }
      );
    }

    try {
      const fixed = jsonrepair(jsonMatch[0]); // Tự động sửa lỗi thiếu dấu phẩy, thừa dấu
      const mealPlan = JSON.parse(fixed);
      return NextResponse.json(mealPlan);
    } catch (e) {
      console.error("❌ JSON parse thất bại:", e);
      return NextResponse.json(
        { error: "Không thể sửa JSON từ AI." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Mealplan generation error:", err);
    return NextResponse.json({ error: "Lỗi nội bộ server" }, { status: 500 });
  }
}

// import { OpenAI } from "openai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req: Request) {
//   const { target, preferences } = await req.json();

//   const { calories, protein, carb, fat } = target;
//   const meals = preferences?.meals || 3;
//   const diet = preferences?.diet || "Bình thường";

//   const prompt = `
// Bạn là chuyên gia dinh dưỡng thể hình. Dựa trên kiến thức chuyên sâu từ The Renaissance Diet 2.0, hãy xây dựng thực đơn trong ngày gồm ${meals} bữa, phù hợp với mục tiêu dinh dưỡng:

// - Tổng năng lượng: ${calories} kcal
// - Protein: ${protein}g
// - Carbohydrate: ${carb}g
// - Fat: ${fat}g

// Chế độ ăn: ${diet}. Ưu tiên chất lượng thực phẩm cao (chậm tiêu hoá, nhiều chất xơ, ít đường nhanh). Mỗi bữa ăn nên có ít nhất 2–3 món, và:
// - Phân phối protein đều giữa các bữa
// - Carb tập trung quanh thời gian tập luyện (bữa trước và sau tập nếu biết)
// - Fat nên ít trong bữa gần thời gian tập, cao hơn ở bữa xa thời gian tập (ví dụ bữa tối)
// - Kèm thêm lời khuyên chế biến (note) đơn giản

// Trả về JSON theo mẫu:
// [
//   {
//     "meal": "Bữa sáng",
//     "items": [
//       { "food": "Ức gà nướng", "quantity": 150 },
//       { "food": "Gạo lứt", "quantity": 100 }
//     ],
//     "note": "Ức gà nướng cùng tiêu, gạo lứt luộc mềm."
//   },
//   ...
// ]
// `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4.1",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const raw = completion.choices[0].message?.content || "[]";
//     const json = JSON.parse(raw);

//     return NextResponse.json(json);
//   } catch (err) {
//     console.error("Lỗi khi gọi OpenAI:", err);
//     return NextResponse.json(
//       { error: "Không thể tạo thực đơn AI" },
//       { status: 500 }
//     );
//   }
// }
