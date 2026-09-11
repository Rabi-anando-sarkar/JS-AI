"use client"

import * as React from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

// single instance of query client for the whole app

export function QueryProvider(
    {children}: {children: React.ReactNode}
) {
    const [queryClient] = React.useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 30 * 1000
                },
            }
        })
    )

    return (
        <QueryClientProvider client = {queryClient}>
            {children}
        </QueryClientProvider>
    )
}