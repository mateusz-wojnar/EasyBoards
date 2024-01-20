import {Toaster} from "sonner"

import { ModalProvider } from "@/components/providers/modal-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";


const PlatformLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <ClerkProvider>
            <EdgeStoreProvider>
                <QueryProvider>
                    <Toaster />
                    <ModalProvider/>
                    {children}
                </QueryProvider>
            </EdgeStoreProvider>
        </ClerkProvider>
    )
}

export default PlatformLayout;