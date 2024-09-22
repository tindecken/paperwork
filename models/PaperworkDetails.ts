import type { SelectCategory, SelectPaperwork } from "../drizzle/schema";

export interface PaperworkDetails extends SelectPaperwork {
    categories: SelectCategory[]
    attachments: [
        {
            id: string
            fileName: string
            fileSize: string
        }
    ],
    images: [
        {
            id: string
            fileName: string
            fileSize: string
            fileBlob: { type: string; data: number[] }
        }
    ],
}