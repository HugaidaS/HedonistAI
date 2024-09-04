/** @type {import('next').NextConfig} */
const nextConfig = {
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
