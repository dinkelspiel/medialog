import { Entry, EntryTranslation } from "@/prisma/generated/browser";

export type EntryWithTranslation = Entry & { translations: EntryTranslation[] }