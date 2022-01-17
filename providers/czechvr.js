//import got from 'got';
const {simple_get} = require('../utils/simple-http');

/** Free Videos: https://www.czechvr.com/free-full-vr-porn-videos-download */

const CzechVR = function () {
    const PROVIDER_ID = 'cvr';
    const DISPLAYNAME = 'CzechVR (free)'
    const self = {};

    let db = {};

    self._load = async function () {
        const buffer = await simple_get(new URL("https://www.czechvrnetwork.com/members/deovr"));
        const json = JSON.parse(buffer);
        db = json;
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
            const req_count = 50;
            const resolution = parsed_path[0];
            const scenes = db.scenes[0].list.slice(0, req_count);//(starting_index, requested_count);

            const dir = [];

            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];

                const entry = {
                    type: 'vid',
                    dlna_id: `${i},${resolution}`,
                    displayname: scene.title,
                    thumbnail_url: scene.thumbnailUrl,
                    thumbnail_mimetype: 'image/jpeg',
                };

                dir.push(entry);
            }

            return dir;
        }

        const dir = [
            {
                type: 'vid',
                dlna_id: '12345', /* video_id */
                displayname: 'A Sweet Surprise _180_LR.mp4',
                thumbnail_url: 'https://www.czechvr.com/category/1816-a-sweet-surprise-468-cvr/468-czechvr-big.jpg',
                thumbnail_mimetype: 'image/jpeg',
            }
        ];
        return [];
    };

    self.get_stream_url = function (video_id) {
        const video_url = "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4";
        return video_url;
    };

    return self;
};

const czechvr = CzechVR();

module.exports = czechvr;