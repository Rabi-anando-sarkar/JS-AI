import { onBoard } from "@/features/auth/action/onBoard"
import { auth } from "@clerk/nextjs/server"
import React from 'react'

const RootGroupLayout = async({ children} : {children: React.ReactNode}) => {
    await auth.protect()
    await onBoard()
    return (
        <ChatShell>
            {children}
        </ChatShell>
    )
}

export default RootGroupLayout