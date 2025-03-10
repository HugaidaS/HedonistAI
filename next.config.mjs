/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.google.com'],
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/vercel-ai',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
