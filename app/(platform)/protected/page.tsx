import { auth,currentUser } from "@clerk/nextjs"
import { deflate } from "zlib"

const ProtectedPage = async () => {
    const user = await currentUser(); //Clerk Hook
    const {userId} = auth();
    return (
        <div>
            User: {user?.firstName}
            UserId: {userId}
        </div>
    )
}

export default ProtectedPage