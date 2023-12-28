/** @type {import('next').NextConfig} */
const nextConfig = {
  // @llamaindex related config
  // experimental: {
  //   serverComponentsExternalPackages: ["llamaindex", "pdf-parse"],
  //   outputFileTracingIncludes: {
  //     "/*": ["./cache/**/*"],
  //   },
  // },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     sharp$: false,
  //     "onnxruntime-node$": false,
  //     mongodb$: false,
  //   };
  //   return config;
  // },
}

module.exports = nextConfig
