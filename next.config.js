import nextMDX from '@next/mdx'
const withMDX = nextMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
}

export default withMDX(nextConfig);
