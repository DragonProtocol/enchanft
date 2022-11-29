// eslint-disable-next-line @typescript-eslint/no-var-requires
const withVideos = require('next-videos');

const nextConfig = {
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = withVideos(nextConfig);
