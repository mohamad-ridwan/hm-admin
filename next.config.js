/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        unoptimized: true
    },
    async redirects(){
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true
            }
        ]
    }
    // output: "export",
    // experimental: {
    //     serverActions: true
    // },
}

module.exports = nextConfig