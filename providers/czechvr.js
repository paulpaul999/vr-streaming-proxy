//import got from 'got';
const {simple_get} = require('../utils/simple-http');

/** Free Videos: https://www.czechvr.com/free-full-vr-porn-videos-download */

const CzechVR = function () {
    const PROVIDER_ID = 'cvr';
    const DISPLAYNAME = 'CzechVR (Trailers)'
    const self = {};

    let db = [

    ];

    self._load = async function () {
        const buffer = await simple_get(new URL("https://www.czechvrnetwork.com/members/deovr"));
        const json = JSON.parse(buffer);
        const data = json;
        db = data.scenes[0].list;
    };
    self._load();

    self.get_provider_id = function () { return PROVIDER_ID; };
    self.get_displayname = function () { return DISPLAYNAME; };

    /**
     * Handles directory requests.
     * 
     * @param {*} spec - contains: dlna_path, starting_index, requested_count
     * @returns 
     */
    self.handle_directory_request = function (spec) {
        const { dlna_path, starting_index, requested_count } = spec;
        const parsed_path = dlna_path.split('/').slice(1);

        const is_provider_root = parsed_path.length === 0;
        const is_scene_overview = parsed_path.length === 1;

        if (is_provider_root) {
            /* Resolution Choices */
            return [
                {
                    type: 'dir',
                    dlna_id: '8k', /* => dir_path+'/misc' */
                    displayname: '8k Resolution',
                },
                {
                    type: 'dir',
                    dlna_id: '5k',
                    displayname: '5k Resolution',
                },
                {
                    type: 'dir',
                    dlna_id: '4k',
                    displayname: '4k Resolution',
                },
            ];
        }

        if (is_scene_overview) {
            const start_idx = 0;
            const req_count = 200;
            const resolution = parsed_path[0];
            const scenes = db.slice(0, req_count);//(starting_index, requested_count);

            const dir = [];

            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];

                const entry = {
                    type: 'vid',
                    dlna_id: `${i},${resolution}`,
                    displayname: `${scene.title}_180_180x180_3dh_LR.mp4`,
                    thumbnail_url: scene.thumbnailUrl,
                    thumbnail_mimetype: 'image/jpeg',
                };

                dir.push(entry);
            }

            return dir;
        }
        
        return [];
    };

    self.get_stream_url = function (video_id) {
        const parsed = video_id.split(',');
        const db_idx = parsed[0];
        const resolution = parsed[1];
        const scene = db[db_idx];
        const video_url_ = scene.encodings[0].videoSources[0].url;
        const head = video_url_.split('-3d-')[0];
        /**
         * 8k https://trailers.czechvr.com/czechvr/videos/download/476/476-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-trailer-1.mp4
         * 5k https://trailers.czechvr.com/czechvr/videos/download/476/476-czechvr-3d-5400x2700-60fps-oculusrift_h265-trailer-1.mp4
         * 4k https://trailers.czechvr.com/czechvr/videos/download/476/476-czechvr-3d-3840x1920-60fps-gearvr-trailer-1_180x180_3dh.mp4
         */
        const tails = {
            '8k': '-3d-7680x3840-60fps-oculusrift_uhq_h265-trailer-1.mp4',
            '5k': '-3d-5400x2700-60fps-oculusrift_h265-trailer-1.mp4',
            '4k': '-3d-3840x1920-60fps-gearvr-trailer-1_180x180_3dh.mp4'
        }
        const tail = tails[resolution];
        const video_url = `${head}${tail}`;
        return video_url;
    };

    return self;
};

const czechvr = CzechVR();

module.exports = czechvr;