-- CreateIndex
CREATE UNIQUE INDEX "categories_name_ownerId_key" ON "categories"("name", "ownerId");
