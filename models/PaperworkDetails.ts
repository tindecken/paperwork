import type { SelectCategory, SelectPaperwork } from "../drizzle/schema";

export interface PaperworkDetails extends SelectPaperwork {
    categories: SelectCategory[]
    attachments?: {
        id: string
        fileName: string
        fileSize: number
        filePath: string
    }[],
    images?: {
        id: string
        fileName: string
        fileSize: number
        filePath: string
        imageArrayBuffer: Uint8Array | null
        isCover: boolean | null
    }[],
}