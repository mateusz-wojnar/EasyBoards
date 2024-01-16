/** @type {import('next').NextConfig} */
const nextConfig = {
    //config image host - clerk
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com"
            }
        ]
    }
}

module.exports = nextConfig
