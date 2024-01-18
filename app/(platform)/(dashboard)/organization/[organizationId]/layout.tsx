import { startCase } from "lodash"
import { auth } from "@clerk/nextjs"

import { OrgControl } from "./_components/org-control"

// function to generate title based on org user is in
export async function generateMetadata() {
    const {orgSlug} = auth()

    return {
        title: startCase(orgSlug || "organization")
    }
        
    
}

const OrganizationIdLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
            <OrgControl />
            {children}
        </div>
    )
}

export default OrganizationIdLayout