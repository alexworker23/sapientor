/** @type {import('next').NextConfig} */
const nextConfig = {
  // @llamaindex related config
    // webpack: (config) => {
    //     config.resolve.alias = {
    //       ...config.resolve.alias,
    //       sharp$: false,
    //       "onnxruntime-node$": false,
    //       mongodb$: false,
    //     };
    //     return config;
    //   },
    //   experimental: {
    //     serverComponentsExternalPackages: ["llamaindex"],
    //     outputFileTracingIncludes: {
    //       "/*": ["./cache/**/*"],
    //     },
    //   },
}

module.exports = nextConfig
