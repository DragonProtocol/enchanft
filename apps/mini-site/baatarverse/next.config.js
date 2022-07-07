// eslint-disable-next-line @typescript-eslint/no-var-requires
// const withNx = require('@nrwl/next/plugins/with-nx');
const withVideos = require('next-videos')
 
/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    loader: 'akamai',
    path: '',
  },
};

module.exports = withVideos(nextConfig);
// module.exports = withNx(withVideos(nextConfig));
