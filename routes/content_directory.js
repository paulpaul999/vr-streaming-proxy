var express = require('express');
const { escape_xml } = require('../utils/xml');

var router = express.Router();

// router.all('/scpd.xml', function (req, res, next) {
// });

/* GET users listing. */
router.all('/control.xml', function(req, res, next) {
  console.log("!!! control.xml !!!", req.rawHeaders, "\nBODY:", req.body);
  const this_host = req.get('host');
  const results = `<DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/" xmlns:sec="http://www.sec.co.kr/" xmlns:xbmc="urn:schemas-xbmc-org:metadata-1-0/">
    <item id="root/1-bigbuckbunny" parentID="0" restricted="1">
      <dc:title>Big Buck Bunny (3D)</dc:title>
      <dc:creator>Unknown</dc:creator>
      <dc:date>2020-12-12</dc:date>
      <dc:publisher>Unknown</dc:publisher>
      <upnp:genre>Unknown</upnp:genre>
      <upnp:episodeSeason>0</upnp:episodeSeason>
      <res size="2601836427" protocolInfo="http-get:*:video/mp4:DLNA.ORG_PN=MPEG4_P2_SP_AAC;DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01500000000000000000000000000000">http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_2160p_60fps_stereo_abl.mp4</res>
      <xbmc:rating>0.0</xbmc:rating>
      <xbmc:userrating>0</xbmc:userrating>
      <upnp:class>object.item.videoItem</upnp:class>
    </item>
    <item id="root/2-bigbuckbunny" parentID="0" restricted="1">
      <dc:title>Big Buck Bunny (Proxy) (3D)</dc:title>
      <dc:creator>Unknown</dc:creator>
      <dc:date>2020-12-12</dc:date>
      <dc:publisher>Unknown</dc:publisher>
      <upnp:genre>Unknown</upnp:genre>
      <upnp:episodeSeason>0</upnp:episodeSeason>
      <res size="2601836427" protocolInfo="http-get:*:video/mp4:DLNA.ORG_PN=MPEG4_P2_SP_AAC;DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01500000000000000000000000000000">http://${this_host}/proxy/funstudio/bunny.mp4</res>
      <xbmc:rating>0.0</xbmc:rating>
      <xbmc:userrating>0</xbmc:userrating>
      <upnp:class>object.item.videoItem</upnp:class>
    </item>
  </DIDL-Lite>`;

  const m = `<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
      <u:BrowseResponse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1">
        <Result>
        ${escape_xml(results)}
        </Result>
        <NumberReturned>2</NumberReturned>
        <TotalMatches>2</TotalMatches>
        <UpdateID>0</UpdateID>
      </u:BrowseResponse>
    </s:Body>
  </s:Envelope>`;

  res.type('text/xml').send(m);
});

module.exports = router;
