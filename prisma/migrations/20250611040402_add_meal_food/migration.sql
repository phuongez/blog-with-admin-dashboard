-- CreateTable
CREATE TABLE "MealPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "mealPlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItem" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carb" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carb" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "fiber" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
