import { readFile } from 'fs/promises';
import got from 'got';

const _slr_select_stream_url = function (scene) {
    const encoding = scene.encodings.reduce((previous, current) => {
        if (current.name === 'h265') {
            return current
        }
        return previous;
    }, scene.encodings[0]);

    const sources = encoding.videoSources;
    const source = sources.reduce((previous, current) => {
        if (current.resolution > previous.resolution) {
            return current;
        }
        return previous;
    }, sources[0]);

    return source.url;
};

const SLR_API = {};

const got_slr = got.extend({
    headers: {
        'user-agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/40.0.2214.111 Chrome/40.0.2214.111 Safari/537.36 HMD/0 [DEO8.3]",
    }
});

SLR_API.get_studios = async function () {
    const json = await got_slr.post('https://api.sexlikereal.com/api_list/getStudios', {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({project: 1, results: 5000, page: 1}).toString(),
    }).json();
    return json.list;
};

SLR_API.get_scenes = async function (query, auth) {
    console.log("SLR_API_getScenes", query);
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (auth !== undefined) {
        headers.cookie = `sess=${auth}`;
    }
    const _query = Object.assign({ project:1, results:5000, page: 1 }, query);
    console.log(new URLSearchParams(_query).toString());
    const json = await got_slr.post('https://api.sexlikereal.com/api_list/getScenes', {
        headers: headers,
        body: new URLSearchParams(_query).toString()
    }).json();
    console.log("SLR_API_getScenes", query, "RX")
    return json.list;
};

const SLR = function () {
    const PROVIDER_ID = 'slr';
    const DISPLAYNAME = 'SLR (Premium)'
    const STATEFILE = 'slr.appstor.json';
    const MAX_REQ_SCENES_COUNT = 250;
    
    const self = {};

    const __load_state = async function (statefile) {
        const buff = await readFile(statefile);
        const json = JSON.parse(buff);
        console.log('SLR loaded', json);
        return json;
    };
    const state = __load_state(STATEFILE);

    const selected_studios = [
        224, // SLR Originals
        53, // RealJamVR
        21, // VRBangers
        51, // SexBabesVR
        64, // VRHush
        213, // VRAllure
        27, // RealityLovers
        96, // VRConk
        112, // SinsVR
        298, // Swallowbay
        153, // VRFanService
        160, // RealHotVR
        79, // StasyQVR
        2, // VirtualRealPorn
        24, // WankzVR
        69, // MILFVR
        110, // VRLatina
        85, // perVRt
        245, // VRedging
        182, // VRsolos
        154, // WankitnowVR
        108, // StripzVR
        123, // xVirtual
        158, // VRIntimacy
        26, // TmwVRNet
        171, // iStripper
        233, // LustReality
        89, // VRSexperts
        97, // VRPFilms
        201, // OnlyTease
        47, // StockingsVR
        257, // No2StudioVR
        247, // BaberoticaVR
        193, // POVcentralVR
        183, // Only3xVR
        266, // Deepinsex
        285, // Squeeze VR
    ];

    let studios_promise = new Promise(async function (resolve, reject) {
        let studios = await SLR_API.get_studios();
        const studio_idx = {}
        studios.forEach(studio => {
            studio_idx[studio.id] = { meta: studio };
        });

        selected_studios.forEach(async (id) => {
            const auth = (await state).auth.sessionID;
            studio_idx[id].scenes_promise = SLR_API.get_scenes({ studio: id, results: MAX_REQ_SCENES_COUNT }, auth);
        });

        resolve(studio_idx);
    });
    


    // studios.then(studios => console.log(studios.slice(0,5)));
    SLR_API.get_scenes({ model:61 });


    let db = [
        {
            title: "[5k+] Melody Marks (SLRO)",
            thumbnail: "https://cdn-vr.sexlikereal.com/images/16390/98729_app.jpg",
            video_urls: {
                'max': "https://cdn-vr.sexlikereal.com/videos_app/h265/16390_2700p.mp4",
                '4k': "https://cdn-vr.sexlikereal.com/videos_app/h265/16390_1920p.mp4",
            }
        },
        //...
    ];

    self.get_provider_id = function () { return PROVIDER_ID; };
    self.get_displayname = function () { return DISPLAYNAME; };

    /**
     * Handles directory requests.
     * 
     * @param {*} spec - contains: dlna_path, starting_index, requested_count
     * @returns 
     */
    self.handle_directory_request = async function (spec) {
        const { dlna_path, starting_index, requested_count } = spec;
        const parsed_path = dlna_path.split('/').slice(1);
        console.log("SLR","handle_directory_request",dlna_path);

        const is_provider_root = parsed_path.length === 0;
        const is_studio_overview = parsed_path.length === 1;
        const is_scene_overview = parsed_path.length === 2;

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

        if (is_studio_overview) {
            const studios = await studios_promise;
            //console.log(studios);

            return selected_studios.map(studio_id => {
                const studio = studios[studio_id];
                return {
                    type: 'dir',
                    dlna_id: String(studio_id),
                    displayname: studio.meta.name,
                }
            });
        }

        if (is_scene_overview) {
            const [resolution, studio_id_str] = parsed_path;
            const studio_id = parseInt(studio_id_str);
            const studios = await studios_promise;
            let scenes = await studios[studio_id].scenes_promise;
            //scenes = scenes.slice(starting_index, starting_index+requested_count);

            const dir = [];

            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];

                let displaytitle = scene.title;
                if (scene.actors) {
                    displaytitle = scene.actors.map(actor => actor.name).join(", ");
                }
                console.log("studio_id",studio_id, "scene.id", scene.id); /* , "scene.name", scene.title); */

                const entry = {
                    type: 'vid',
                    dlna_id: `${i},${resolution}`,
                    stream_url: _slr_select_stream_url(scene),
                    displayname: `${displaytitle}_180_180x180_3dh_LR.mp4`,
                    thumbnail_url: scene.thumbnailUrl,
                    thumbnail_mimetype: 'image/jpeg',
                };

                dir.push(entry);
            }

            return dir;
        }

        return [];
    };

    self.get_stream_url = async function (video_id) {
        // const parsed = video_id.split(',');
        // const db_idx = parsed[0];
        // const resolution = parsed[1];
        // const scene = db[db_idx];
        // const video_url = scene.video_urls[resolution];
        let video_url = "https://cdn-vr.sexlikereal.com/full_videos_app/h265/22136_3840p.mp4?Expires=1642655832&Signature=sZIz%2BG7unZMuqPQ9YzERiMONx38%3D&AWSAccessKeyId=F8ADCFF63A8AB7F3EC6BF4B85366A1B3";
        return video_url;
    };

    return self;
};

// const slr = SLR();

export default SLR();