import { readFile } from 'fs/promises';
import got from 'got';

/**
 * Traverse a route along a table to find the right handlers.
 * 
 * @param {object} table that is traversed 
 * @param {string[]} route as an array of strings
 * @param {object} req object that is passed to the handler along with 'vars' key containing the variables defined during route traversal
 */
const traverse_route = function (table, route, req) {
    if (!req) { req = {}; }
    if (!req.$vars) { req.$vars = {}; } 
    
    const [route_id, ...subroute] = route;

    if (table.hasOwnProperty('varname')) {
        req.$vars[table.varname] = route_id;
    }

    const end_of_route = route.length === 0;
    const show_list = end_of_route || Boolean(table.stop_routing);
    if (show_list) {
        const { list } = table;
        if (typeof (list) === 'function') {
            req.$subroute = subroute;
            return list(req);
        }

        /* list is a static object */
        const dir_listing = Object.entries(list).map(entry => {
            const [key, value] = entry;
            return { type: 'dir', dlna_id: key, displayname: value };
        });
        return dir_listing;
    }
    
    /* match route */
    const { subroutes } = table;
    let subtable = subroutes?.$default;

    if (subroutes?.hasOwnProperty(route_id)) {
        subtable = subroutes[route_id];
    }
    
    if (subtable) {
        return traverse_route(subtable, subroute, req);
    }

    /* no matching route found */
    return [];
};

const split_path = function (input_path) {
    const split_char = '/';

    let root = input_path;
    let subpath = '';

    const pos = input_path.indexOf(split_char);
    const found_char = pos >= 0;
    if (found_char) {
        root = input_path.slice(0, pos);
        subpath = input_path.slice(pos+1);
    }
    return [root, subpath];
}

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
    if (auth !== undefined) { headers.cookie = `sess=${auth}`; }
    const _query = { project: 1, results: 5000, page: 1, ...query };
    const json = await got_slr.post('https://api.sexlikereal.com/api_list/getScenes', {
        headers: headers,
        body: new URLSearchParams(_query).toString()
    }).json();
    console.log("SLR_API_getScenes", query, "RX")
    return json.list;
};

SLR_API.get_models = async function (query, auth) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (auth !== undefined) { headers.cookie = `sess=${auth}`; }
    const _query = { project: 1, results: 10000, page: 1, ...query }; // TODO: Paginated requests
    const json = await got_slr('https://api.sexlikereal.com/api_list/getModels', {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams(_query).toString()
    }).json();
    return json.list;
};

SLR_API.get_checkuserpayment = async function (auth) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (auth !== undefined) { headers.cookie = `sess=${auth}`; }
    const json = await got_slr('https://api.sexlikereal.com/api/checkuserpayment', {
        method: 'POST',
        headers: headers,
    }).json();
    console.log('checkuserpayment');
    console.log(json)
    const is_logged_in = json.code === 1 && json.status === 'success';
    return is_logged_in;
};

const SLR = function () {
    const PROVIDER_ID = 'slr';
    const DISPLAYNAME = 'SLR (Premium)'
    const STATEFILE = 'slr.appstor.json';
    const MAX_REQ_SCENES_COUNT = 150;
    
    const self = {};

    const scenes_db = {}; /* TODO: user more efficient data structure */

    const __load_state = async function (statefile) {
        const buff = await readFile(statefile);
        const json = JSON.parse(buff);
        console.log('SLR loaded', json);
        return json;
    };
    // const state = __load_state(STATEFILE);

    // TODO: load state from file again
    const state = async function () {
        return {
            auth: { sessionID: "0" },
            db: []
        }
    }();

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
        351, // DeviantsVR
        342, // KinkyGirlsBerlin
    ];

    let studios_promise =  SLR_API.get_studios();

    self.get_provider_id = function () { return PROVIDER_ID; };
    self.get_displayname = function () { return DISPLAYNAME; };

    self.set_cookies = async function (cookies) {
        let sess = [];
        try {
            const json = JSON.parse(cookies);
            sess = json.reduce((previous, current) => {
                if (current.name.toLowerCase() === 'sess' && current.domain.toLowerCase().includes('sexlikereal')) {
                    return current.value;
                }
                return previous;
            }, undefined);
        } catch (error) {
            return { logged_in: false, msg: ['Invalid cookie format'] };
        }
        
        if (!sess) { return { logged_in: false, msg: ['No "sess" Cookie found.'] }; }

        const auth = (await state).auth;
        auth.sessionID = sess;

        const is_logged_in = await self._is_logged_in();
        let result = { logged_in: false, msg: ['FAIL: Cookie invalid or stale.', `Cookie: ${sess}`] };
        if (is_logged_in) {
            result.logged_in = true;
            result.msg = ['Success! Cookie is valid.', `Cookie: ${sess}`];
        }
        return result;
    };

    self._is_logged_in = async function () {
        const auth = (await state).auth.sessionID;
        return await SLR_API.get_checkuserpayment(auth);
    };

    self.get_status = async function () {
        const auth = (await state).auth.sessionID;
        const is_logged_in = await self._is_logged_in();

        return {
            Status: is_logged_in ? 'Logged in' : 'Logged out',
            Cookie: auth
        }
    };

    self._list_studios = async function () {
        const studios = await studios_promise;
        let selected_studios_ = studios.filter(studio => selected_studios.includes(studio.id));

        return selected_studios_.map(studio => {
            return {
                type: 'dir',
                dlna_id: String(studio.id),
                displayname: studio.name,
            }
        });
    };

    self._list_videos_by_scene_ids = async function (spec) {
        const {resolution, starting_index, requested_count} = spec;
        let {scene_ids} = spec;
        scene_ids = scene_ids.slice(starting_index, starting_index+requested_count);

        const dir = [];

        scene_ids.forEach(scene_id => {
            const scene = scenes_db[scene_id];

            let displaytitle = scene.title;
            if (scene.actors) {
                displaytitle = scene.actors.map(actor => actor.name).join(", ");
            }
            displaytitle = `${displaytitle}_${scene.id}`;

            console.log("scene.id", scene.id); /* , "scene.name", scene.title); */

            const entry = {
                type: 'vid',
                dlna_id: `${scene.id},${resolution}`,
                stream_url: _slr_select_stream_url(scene),
                displayname: `${displaytitle}_180_180x180_3dh_LR.mp4`,
                thumbnail_url: scene.thumbnailUrl,
                thumbnail_mimetype: 'image/jpeg',
            };

            dir.push(entry);
        });

        return dir;
    };

    self._list_videos_by_api_request = async function (spec, api_parameters) {
        const auth = (await state).auth.sessionID;
        const scenes = await SLR_API.get_scenes({ results: MAX_REQ_SCENES_COUNT, show_jav_scenes: false, ...api_parameters }, auth);
        scenes.forEach(scene => { /* TODO: introduce auto-adding to db after server response */
            scenes_db[scene.id] = scene;
        });
        const scene_ids = scenes.map(scene => scene.id);
        return self._list_videos_by_scene_ids({...spec, scene_ids});
    };

    self._list_fav_models = async function (spec) {
        const auth = (await state).auth.sessionID;
        const all_models = await SLR_API.get_models({}, auth);
        const fav_models = all_models.filter(model => model.isFavorite);
        const dir_list = fav_models.map(model => {
            return {
                type: 'dir',
                dlna_id: String(model.id),
                displayname: model.name,
            }
        });
        return dir_list;
    };

    const ROUTING_TABLE = {
        varname: undefined, /* if varname is undefined dlna_id is not stored */
        list: {
            all_scenes: 'All Scenes',
            studios: 'Studios',
            fav_models: 'Favourite Models'
        },
        subroutes: {
            all_scenes: {
                list: req => self._list_videos_by_api_request({ ...req }, {})
            },
            studios: {
                varname: 'studio_id',
                list: req => self._list_studios(),
                subroutes: {
                    $default: {
                        list: req => self._list_videos_by_api_request({ ...req }, { studio: req.$vars.studio_id, results: MAX_REQ_SCENES_COUNT })
                    }
                }
            },
            fav_models: {
                varname: 'model_id',
                list: req => self._list_fav_models({ ...req }),
                subroutes: {
                    $default: {
                        list: req => self._list_videos_by_api_request({ ...req }, { model: req.$vars.model_id })
                    }
                }
            }
        }
    };

    /**
     * Handles directory requests.
     * 
     * @param {*} spec - contains: dlna_path, starting_index, requested_count
     * @returns 
     */
    self.handle_directory_request = async function (req) {
        const { dlna_path, starting_index, requested_count } = req;
        console.log("SLR","handle_directory_request",dlna_path);

        const parsed_route = dlna_path.split('/').slice(1);
        return traverse_route(ROUTING_TABLE, parsed_route, {...req});
    };

    self.get_stream_url = async function (video_id) {
        // const parsed = video_id.split(',');
        // const db_idx = parsed[0];
        // const resolution = parsed[1];
        // const scene = db[db_idx];
        // const video_url = scene.video_urls[resolution];
        let video_url = "https://cdn-vr.sexlikereal.com/videos_app/h265/16390_2700p.mp4";
        return video_url;
    };

    return self;
};

// const slr = SLR();

export default SLR();