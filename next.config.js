/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**'
            },
            {
                // Clerk profile pictures (author profiles)
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '/**'
            }
        ]
    }
}

module.exports = nextConfig
