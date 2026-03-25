/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
   images: {
    domains: ["images.unsplash.com"], // ✅ Add allowed remote image domains here
  },
  reactCompiler: true,
};

export default nextConfig;
