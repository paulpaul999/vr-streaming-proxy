import express from 'express';
import { escape_xml } from '../utils/xml.mjs';

const router = express.Router();

import provider_manager from '../providers/manager.mjs';

const DLNA_MIMETYPE_LOOKUP = {
    "audio/mpeg": "DLNA.ORG_PN=MP3",
    "audio/mp4": "DLNA.ORG_PN=AAC_ISO_320",
    "audio/x-wav": "DLNA.ORG_PN=WAV",
    "audio/x-ms-wma": "DLNA.ORG_PN=WMABASE",
    "image/jpeg": "DLNA.ORG_PN=JPEG_LRG",
    "image/jp2": "DLNA.ORG_PN=JPEG_LRG",
    "image/png": "DLNA.ORG_PN=PNG_LRG",
    "image/bmp": "DLNA.ORG_PN=BMP_LRG",
    "image/tiff": "DLNA.ORG_PN=TIFF_LRG",
    "image/gif": "DLNA.ORG_PN=GIF_LRG",
    "video/avi": "DLNA.ORG_PN=AVI",
    "video/mpeg": "DLNA.ORG_PN=MPEG_PS_PAL",
    "video/mp4": "DLNA.ORG_PN=MPEG4_P2_SP_AAC",
    "video/x-ms-wmv": "DLNA.ORG_PN=WMVMED_FULL",
    "video/x-msvideo": "DLNA.ORG_PN=AVI",
};

const dlna_generate_video_xml = function (spec) {
    /**
     * TODO:
     * - <item ... searchable="0"> ? (XBVR)
     * - mimetype of image resource
     */
    const { element, parent_id, local_url_generator, provider_id } = spec;

    const video_id = element.dlna_id;
    let video_url = local_url_generator(`/proxy/stream/${provider_id}/${video_id}`);
    if (element.stream_url) {
        video_url = local_url_generator(`/proxy/url/${encodeURIComponent(element.stream_url)}`);
    }
    const dlna_item_id = `${parent_id}/${video_id}`;
    const thumbnail_url = local_url_generator(`/proxy/url/${encodeURIComponent(element.thumbnail_url)}`);
    const thumbnail_mimetype = element.thumbnail_mimetype || 'image/jpeg';

    let thumbnail_xml = '';
    if (element.thumbnail_url) {
        thumbnail_xml = `<upnp:icon>${thumbnail_url}</upnp:icon>
        <upnp:albumArtURI>${thumbnail_url}</upnp:albumArtURI>
        <res protocolInfo="http-get:*:${thumbnail_mimetype}:${DLNA_MIMETYPE_LOOKUP[thumbnail_mimetype]}">${thumbnail_url}</res>`;
    }

    const xml = `<item id="${dlna_item_id}" parentID="${parent_id}" restricted="1" searchable="0">
    <dc:title>${element.displayname}</dc:title>
    <dc:creator>Unknown</dc:creator>
    <dc:date>2020-01-01</dc:date>
    <dc:publisher>Unknown</dc:publisher>
    <upnp:genre>Unknown</upnp:genre>
    <upnp:episodeSeason>0</upnp:episodeSeason>
    <res size="10000000000" protocolInfo="http-get:*:video/mp4:DLNA.ORG_PN=MPEG4_P2_SP_AAC;DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01500000000000000000000000000000">${video_url}</res>
    ${thumbnail_xml}
    <xbmc:rating>0.0</xbmc:rating>
    <xbmc:userrating>0</xbmc:userrating>
    <upnp:class>object.item.videoItem</upnp:class>
    </item>`;
    return xml;
};

const dlna_generate_directory_xml = function (spec) {
    /**
     * TODO:
     * - <item ... searchable="0"> ? (XBVR)
     * - mimetype of image resource
     */
    const { element, parent_id, dlna_item_id } = spec;

    const xml = `<container id="${dlna_item_id}" parentID="${parent_id}" restricted="1" searchable="0">
        <dc:title>${element.displayname}</dc:title>
        <dc:creator>Unknown</dc:creator>
        <dc:publisher>Unknown</dc:publisher>
        <upnp:genre>Unknown</upnp:genre>
        <upnp:episodeSeason>0</upnp:episodeSeason>
        <xbmc:rating>0.0</xbmc:rating>
        <xbmc:userrating>0</xbmc:userrating>
        <upnp:class>object.container</upnp:class>
    </container>`;
    return xml;
};

/* GET users listing. */
router.all('/control.xml', async function (req, res, next) {
    //console.log("!!! control.xml !!!", req.rawHeaders, "\nBODY:", req.body);

    /** TODO: probably more cleaner way for getting server's ip https://stackoverflow.com/a/38426473
     * req.connection.localAddress and req.connection.localPort
     * check for IPv6: https://nodejs.org/api/net.html#netisipv6input
    */
    const this_host_and_port = req.headers.host;
    const base_url = `http://${this_host_and_port}`
    const local_url_generator = function (subpath) {
        const url_obj = new URL(String(subpath), base_url);
        return url_obj.toString();
    };

    const browse = req.body['s:Envelope']['s:Body'][0]['u:Browse'][0];
    const object_id = browse.ObjectID[0];
    const starting_index = parseInt(browse.StartingIndex[0]);
    const requested_count = parseInt(browse.RequestedCount[0]);
    const dlna_path = object_id;


    // console.log({object_id, starting_index, requested_count});

    const { listing, provider_id } = await provider_manager.handle_directory_request({ dlna_path, starting_index, requested_count });

    const xml_array = listing.map(element => {
        let xml_generator = dlna_generate_directory_xml;
        if (element.type === 'vid') { xml_generator = dlna_generate_video_xml; }
        
        const parent_id = dlna_path;

        let dlna_item_id = `${parent_id}/${element.dlna_id}`;
        if (parent_id === '0') { dlna_item_id = element.dlna_id ; }

        return xml_generator({ element, parent_id, local_url_generator, provider_id, dlna_item_id });
    });

    const results = `<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/" xmlns:sec="http://www.sec.co.kr/" xmlns:xbmc="urn:schemas-xbmc-org:metadata-1-0/">
        ${ xml_array.join("\n") }
    </DIDL-Lite>`;

    // console.log("!!!!!!!!! ControlService:", results);

    /* TODO: <TotalMatches> */
    const m = `<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body>
        <u:BrowseResponse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
            <Result>
            ${escape_xml(results)}
            </Result>
            <NumberReturned>${listing.length}</NumberReturned>
            <TotalMatches>${listing.length}</TotalMatches>
            <UpdateID>0</UpdateID>
        </u:BrowseResponse>
        </s:Body>
    </s:Envelope>`;

    res.type('text/xml').send(m);
});

export default router;
