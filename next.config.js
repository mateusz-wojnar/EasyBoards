/** @type {import('next').NextConfig} */
const nextConfig = {
    //config image host - clerk
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com"
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com"
            }
        ]
    }
}

module.exports = nextConfig
