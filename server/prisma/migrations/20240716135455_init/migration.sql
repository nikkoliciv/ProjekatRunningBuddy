-- CreateTable
CREATE TABLE "Itinerary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItineraryToPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_userId_key" ON "Itinerary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItineraryToPlan_AB_unique" ON "_ItineraryToPlan"("A", "B");

-- CreateIndex
CREATE INDEX "_ItineraryToPlan_B_index" ON "_ItineraryToPlan"("B");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryToPlan" ADD CONSTRAINT "_ItineraryToPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryToPlan" ADD CONSTRAINT "_ItineraryToPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
