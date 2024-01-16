import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
 

export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req) {
      // user is logged in and tries to visit landing page - redirec to create org
      if (auth.userId && auth.isPublicRoute) {
        let path = "/select-org"
        
        // user logged in and has organization - redirect to organization
        if (auth.orgId) {
          path = `/organization/${auth.orgId}`
        }

        const orgSelection = new URL(path, req.url)
        return NextResponse.redirect(orgSelection)
      }

      // if not logged in and not on public route - redirect to sign in page
      if (!auth.userId && !auth.isPublicRoute) {
        return redirectToSignIn({returnBackUrl: req.url}) // after sign in - return the url that user tried to acces
      }

      // if user logged in and not in organization and if path is not create org page
      // force logged in user without org to create org
      if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
        const orgSelection = new URL("/select-org", req.url)
        return NextResponse.redirect(orgSelection)
      }
    }
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};