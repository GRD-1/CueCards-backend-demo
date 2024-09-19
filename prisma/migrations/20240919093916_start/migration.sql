-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR NOT NULL,
    "avatar" VARCHAR,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "userId" UUID NOT NULL,
    "password" VARCHAR NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastPassword" VARCHAR NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "acronym" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "fsLanguage" TEXT NOT NULL DEFAULT 'ru',
    "fsValue" VARCHAR NOT NULL,
    "fsDescription" VARCHAR DEFAULT '',
    "fsMeaningVariants" TEXT[],
    "fsWrongMeanings" TEXT[],
    "fsTranscription" VARCHAR,
    "fsSynonyms" TEXT[],
    "fsAudio" VARCHAR,
    "fsHint" VARCHAR,
    "bsLanguage" TEXT NOT NULL DEFAULT 'en',
    "bsValue" VARCHAR NOT NULL,
    "bsDescription" VARCHAR DEFAULT '',
    "bsMeaningVariants" TEXT[],
    "bsWrongMeanings" TEXT[],
    "bsTranscription" VARCHAR,
    "bsSynonyms" TEXT[],
    "bsAudio" VARCHAR,
    "bsHint" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dictionaries" (
    "id" SERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "fsName" VARCHAR NOT NULL,
    "bsName" VARCHAR NOT NULL,
    "fsLanguage" TEXT NOT NULL DEFAULT 'ru',
    "bsLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "dictionaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "fsValue" VARCHAR NOT NULL,
    "bsValue" VARCHAR NOT NULL,
    "fsLanguage" TEXT NOT NULL DEFAULT 'ru',
    "bsLanguage" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_tags" (
    "cardId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "card_tag_unique_constraint" PRIMARY KEY ("cardId","tagId")
);

-- CreateTable
CREATE TABLE "dictionary_tags" (
    "dictionaryId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "dictionary_tags_pkey" PRIMARY KEY ("dictionaryId","tagId")
);

-- CreateTable
CREATE TABLE "card_statistics" (
    "cardId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "fsTotalAnswers" INTEGER NOT NULL,
    "fsCorrectAnswers" INTEGER NOT NULL,
    "bsTotalAnswers" INTEGER NOT NULL,
    "bsCorrectAnswers" INTEGER NOT NULL,

    CONSTRAINT "card_user_unique_constraint" PRIMARY KEY ("cardId","userId")
);

-- CreateTable
CREATE TABLE "card_is_hidden" (
    "cardId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "card_user_constraint" PRIMARY KEY ("cardId","userId")
);

-- CreateTable
CREATE TABLE "settings" (
    "userId" UUID NOT NULL,
    "appLanguage" TEXT NOT NULL DEFAULT 'ru',
    "trainingLanguage" TEXT NOT NULL DEFAULT 'en',
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "hints" BOOLEAN NOT NULL DEFAULT true,
    "voicing" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "dictionaryId" INTEGER NOT NULL,
    "totalAnswers" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "trainingTime" INTEGER NOT NULL,
    "hintsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteMark" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "languages_acronym_key" ON "languages"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "cards_fsValue_key" ON "cards"("fsValue");

-- CreateIndex
CREATE UNIQUE INDEX "cards_bsValue_key" ON "cards"("bsValue");

-- CreateIndex
CREATE UNIQUE INDEX "dictionaries_fsName_key" ON "dictionaries"("fsName");

-- CreateIndex
CREATE UNIQUE INDEX "dictionaries_bsName_key" ON "dictionaries"("bsName");

-- CreateIndex
CREATE UNIQUE INDEX "tags_fsValue_key" ON "tags"("fsValue");

-- CreateIndex
CREATE UNIQUE INDEX "tags_bsValue_key" ON "tags"("bsValue");

-- CreateIndex
CREATE INDEX "statistics_userId_dictionaryId_createdAt_idx" ON "statistics"("userId", "dictionaryId", "createdAt");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_fsLanguage_fkey" FOREIGN KEY ("fsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_bsLanguage_fkey" FOREIGN KEY ("bsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_fsLanguage_fkey" FOREIGN KEY ("fsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_bsLanguage_fkey" FOREIGN KEY ("bsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_fsLanguage_fkey" FOREIGN KEY ("fsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_bsLanguage_fkey" FOREIGN KEY ("bsLanguage") REFERENCES "languages"("acronym") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "card_tags" ADD CONSTRAINT "card_tags_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_tags" ADD CONSTRAINT "card_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dictionary_tags" ADD CONSTRAINT "dictionary_tags_dictionaryId_fkey" FOREIGN KEY ("dictionaryId") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dictionary_tags" ADD CONSTRAINT "dictionary_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_statistics" ADD CONSTRAINT "card_statistics_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_statistics" ADD CONSTRAINT "card_statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_is_hidden" ADD CONSTRAINT "card_is_hidden_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_is_hidden" ADD CONSTRAINT "card_is_hidden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_appLanguage_fkey" FOREIGN KEY ("appLanguage") REFERENCES "languages"("acronym") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_trainingLanguage_fkey" FOREIGN KEY ("trainingLanguage") REFERENCES "languages"("acronym") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_dictionaryId_fkey" FOREIGN KEY ("dictionaryId") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
