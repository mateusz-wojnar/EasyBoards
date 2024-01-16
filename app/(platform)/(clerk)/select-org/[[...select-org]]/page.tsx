import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <OrganizationList 
        hidePersonal //hide personal acc as organization
        afterSelectOrganizationUrl="/organization/:id"
        afterCreateOrganizationUrl="/organization/:id"
        />
    )
}