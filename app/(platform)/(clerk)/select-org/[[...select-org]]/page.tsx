import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <OrganizationList 
        hidePersonal //hide personal acc as organization
        afterSelectOrganizationUrl="/organization/:id" // :id - slug
        afterCreateOrganizationUrl="/organization/:id"
        />
    )
}