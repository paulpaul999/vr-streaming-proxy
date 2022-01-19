//import got from 'got';
import {simple_get} from '../utils/simple-http.mjs';

/** Free Videos: https://www.czechvr.com/free-full-vr-porn-videos-download */

const SLR_PoC = function () {
    const PROVIDER_ID = 'slrpoc';
    const DISPLAYNAME = 'SLR (selected trailers)'
    const self = {};

    let db = [
        {
            title: "[5k+] Melody Marks (SLRO)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/16390/98729_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/16390_2700p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/16390_1920p.mp4",
            }
        },
        {
            title: "[5k+] Blake Blossom (SLRO)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/16265/98393_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/16265_2700p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/16265_1920p.mp4",
            }
        },
        {
            title: "[6k] Haley Spades (VRFanService)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/22146/129627_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/22146_3072p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/22146_1920p.mp4",
            }
        },
        {
            title: "[5k+] Alyx Star (RealJamVR)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/18478/110802_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/18478_2700p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h264/18478_1920p.mp4",
            }
        },
        {
            title: "[8k] Alex Coal (VRHush)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/22077/129245_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/22077_3840p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/22077_1920p.mp4",
            }
        },
        {
            title: "[8k] Alina Lopez (VRBangers)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/19200/113902_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/19200_3840p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/19200_1920p.mp4",
            }
        },
        {
            title: "[8k] Elina Sweet (VRIntimacy)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/20567/121290_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/20567_3840p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/20567_1920p.mp4",
            }
        },
    ];

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
                    dlna_id: 'max', /* => dir_path+'/misc' */
                    displayname: 'Prefer 5k+',
                },
                {
                    type: 'dir',
                    dlna_id: '4k',
                    displayname: 'Prefer 4k',
                },
            ];
        }

        if (is_scene_overview) {
            // const start_idx = 0;
            // const req_count = 200;
            const resolution = parsed_path[0];
            const scenes = db;//.slice(starting_index, requested_count);

            const dir = [];

            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];

                const entry = {
                    type: 'vid',
                    dlna_id: `${i},${resolution}`,
                    stream_url: scene.video_urls[resolution],
                    displayname: `${scene.title}_180_180x180_3dh_LR.mp4`,
                    thumbnail_url: scene.thumbnail,
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
        const video_url = scene.video_urls[resolution];
        return video_url;
    };

    return self;
};

const slr_poc = SLR_PoC();

export default slr_poc;