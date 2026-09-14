"use server"

import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache";

export type ConversationListItem = {
    id: string;
    title: string;
    isPinned: boolean;
    isArchived: boolean;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export async function assertOwnConversation(conversationId: string, userId:string) {
    const conversation = await prisma.conversation.findFirst(
        {
            where: {
                id: conversationId,
                userId
            }
        }
    )

    if(!conversation) {
        throw new Error("Conversation not found")
    }

    return conversation
}

// CRUD (READ)
export async function listConversation(): Promise<ConversationListItem[]> {
    const user = await requireUser()

    return prisma.conversation.findMany(
        {
            where: {
                userId: user.id,
                isArchived: false
            },
            orderBy: [
                {
                    isPinned: "desc"
                },
                {
                    lastMessageAt: "desc"
                }
            ],
            select: {
                id: true,
                title: true,
                isPinned: true,
                isArchived: true,
                lastMessageAt: true,
                createdAt: true,
                updatedAt: true
            }
        }
    )
}

// CRUD (CREATE)
export async function createConversation(title = "New Chat") {
    const user = await requireUser()

    return prisma.conversation.create(
        {
            data: {
                userId: user.id,
                title: title.trim() || "New Chat"
            }
        }
    )
}

// CRUD (UPDATE)
export async function updateConversation(
    conversationId: string, 
    data: {
        title?: string,
        isPinned?: boolean,
        isArchived?: boolean
    }) {
        const user = await requireUser()

        await assertOwnConversation(conversationId, user.id)

        const conversation = await prisma.conversation.update(
            {
                where: {
                    id: conversationId
                }, 
                data: {
                    ...(data.title !== undefined ? { title: data.title.trim() || "New Chat"} : {}),
                    ...(data.isPinned !== undefined ? {isPinned: data.isPinned} : {}),
                    ...(data.isArchived !== undefined ? { isArchived: data.isArchived} : {}),
                }
            }
        )

        revalidatePath("/")
        revalidatePath(`/c/${conversationId}`)
        return conversation
    }

// CRUD (DELETE)
export async function deleteConversation(conversationId: string) {
    const user = await requireUser()

    await assertOwnConversation(conversationId, user.id)

    await prisma.conversation.delete(
        {
            where: {
                id: conversationId
            }
        }
    )

    revalidatePath("/")

    return {
        id: conversationId
    }
}