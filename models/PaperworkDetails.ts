import type { SelectCategory, SelectPaperwork } from "../drizzle/schema";

export interface PaperworkDetails extends SelectPaperwork {
    categories: SelectCategory[]
    attachments?: {
        id: string
        fileName: string
        fileSize: number
    }[],
    images?: {
        id: string
        fileName: string
        fileSize: number
        fileBlob: unknown
        isCover: boolean
    }[],
}