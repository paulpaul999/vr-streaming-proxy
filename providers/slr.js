const SLR = function () {
    const PROVIDER_ID = 'slr';
    const self = {};

    self.get_provider_id = function () { return PROVIDER_ID; };

    self.handle_directory_request = function (directory_path) {
        const dir = [
            {
                type: 'dir',
                pathname: 'misc' /* => dir_path+'/misc' */
            },
            {
                type: 'vid',
                scene_id: '12345',
                pic: 'https://www.czechvr.com/category/1816-a-sweet-surprise-468-cvr/468-czechvr-big.jpg'
            }
        ];
        return dir;
    };

    self.get_stream_url = function (scene_id) {
        const video_url = "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4";
        return video_url;
    };

    return self;
};

const slr = SLR();

module.exports = slr;