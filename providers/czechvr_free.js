//import got from 'got';
const {simple_get} = require('../utils/simple-http');

/** Free Videos: https://www.czechvr.com/free-full-vr-porn-videos-download */

const CzechVRFree = function () {
    const PROVIDER_ID = 'cvrfree';
    const DISPLAYNAME = 'CzechVR (full length free)'
    const self = {};

    let db = [
        {
            title: "A Sweet Surprise",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1816-a-sweet-surprise-468-cvr/468-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/468/468-czechvr-3d-3840x1920-60fps-gearvr-fullvideo-1_180x180_3dh.mp4",
            }
        },
        {
            title: "Christmas Wood",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1652-christmas-wood-390-cvr/390-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/390/390-czechvr-3d-7680x3840-60fps-oculusrift_uhq_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/390/390-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/390/390-czechvr-3d-3840x1920-60fps-gearvr-fullvideo-1_180x180_3dh.mp4",
            }
        },
        {
            title: "[5k-max] Endless Fun",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr-fetish/1553-endless-fun-242-cvf/242-czechvrfetish-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvrfetish/videos/download/242/242-czechvrfetish-3d-5400x2700-60fps-oculusrift_uhq_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvrfetish/videos/download/242/242-czechvrfetish-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvrfetish/videos/download/242/242-czechvrfetish-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4",
            }
        },
        {
            title: "[5k-max] Time Stopped",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1531-time-stopped-336-cvr/336-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/336/336-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/336/336-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/336/336-czechvr-3d-3840x1920-60fps-gearvr-fullvideo-1_180x180_3dh.mp4",
            }
        },
        {
            title: "[5k-max] Christmas With a Bang",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1498-christmas-with-a-bang-321-cvr/321-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/321/321-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/321/321-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/321/321-czechvr-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Special Gifts",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1326-special-gifts-255-cvr/255-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/255/255-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/255/255-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/255/255-czechvr-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Obsessed by her Amazing Face",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr-fetish/1319-obsessed-by-her-amazing-face-159-cvf/159-czechvrfetish-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvrfetish/videos/download/159/159-czechvrfetish-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvrfetish/videos/download/159/159-czechvrfetish-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvrfetish/videos/download/159/159-czechvrfetish-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Foursome Christmas for Everyone",
            thumbnail: "https://www.czechvrnetwork.com/category/czech-vr/1161-foursome-christmas-for-everyone-183-cvr/183-czechvr-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/czechvr/videos/download/183/183-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/czechvr/videos/download/183/183-czechvr-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/czechvr/videos/download/183/183-czechvr-3d-3840x1920-60fps-gearvr-fullvideo-1_180x180_3dh.mp4"
            }
        },
        {
            title: "[5k-max] Look deep into Dee's eyes",
            thumbnail: "https://www.czechvrnetwork.com/category/vr-intimacy/1381-look-deep-into-dee-s-eyes-005-vri/005-vrintimacy-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/vrintimacy/videos/download/005/005-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/vrintimacy/videos/download/005/005-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/vrintimacy/videos/download/005/005-vrintimacy-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Truly Intimate",
            thumbnail: "https://www.czechvrnetwork.com/category/vr-intimacy/1370-truly-intimate-004-vri/004-vrintimacy-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/vrintimacy/videos/download/004/004-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/vrintimacy/videos/download/004/004-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/vrintimacy/videos/download/004/004-vrintimacy-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Shes Always Shining",
            thumbnail: "https://www.czechvrnetwork.com/category/vr-intimacy/1365-she-s-always-shining-003-vri/003-vrintimacy-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/vrintimacy/videos/download/003/003-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/vrintimacy/videos/download/003/003-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/vrintimacy/videos/download/003/003-vrintimacy-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Very Close Experience",
            thumbnail: "https://www.czechvrnetwork.com/category/vr-intimacy/1357-very-close-experience-002-vri/002-vrintimacy-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/vrintimacy/videos/download/002/002-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/vrintimacy/videos/download/002/002-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/vrintimacy/videos/download/002/002-vrintimacy-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
            }
        },
        {
            title: "[5k-max] Intimate Stacy Cruz",
            thumbnail: "https://www.czechvrnetwork.com/category/vr-intimacy/1347-intimate-stacy-cruz-001-vri/001-vrintimacy-big.jpg",
            video_urls: {
                '8k': "https://trailers.czechvr.com/vrintimacy/videos/download/001/001-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '5k': "https://trailers.czechvr.com/vrintimacy/videos/download/001/001-vrintimacy-3d-5400x2700-60fps-oculusrift_h265-fullvideo-1.mp4",
                '4k': "https://trailers.czechvr.com/vrintimacy/videos/download/001/001-vrintimacy-3d-3840x1920-60fps-oculusrift-fullvideo-1.mp4"
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
                    dlna_id: '8k', /* => dir_path+'/misc' */
                    displayname: 'Prefer 8k',
                },
                {
                    type: 'dir',
                    dlna_id: '5k',
                    displayname: 'Prefer 5k',
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

const czechvrfree = CzechVRFree();

module.exports = czechvrfree;