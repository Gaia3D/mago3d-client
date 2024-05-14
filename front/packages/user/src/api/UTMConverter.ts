export type UTMType = {
    zoneNum: number;
    zoneLetter: string;
    easting: number;
    northing: number;
};
  
/**
 * Converts a set of Longitude and Latitude co-ordinates to UTM
 * using the WGS84 ellipsoid.
 *
 * @private
 * @param {object} ll Object literal with lat and lon properties
 *     representing the WGS84 coordinate to be converted.
 * @return {object} Object literal containing the UTM value with easting,
 *     northing, zoneNum and zoneLetter properties, and an optional
 *     accuracy property in digits. Returns null if the conversion failed.
 */
export function DDtoUTM(DD: { lat: number; lon: number }) {
  const Lat = DD.lat;
  const Long = DD.lon;
  const a = 6378137.0; //ellip.radius;
  const eccSquared = 0.00669438; //ellip.eccsq;
  const k0 = 0.9996;
  const LatRad = degToRad(Lat);
  const LongRad = degToRad(Long);

  let zoneNum = Math.floor((Long + 180) / 6) + 1;

  //Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    zoneNum = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    zoneNum = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      zoneNum = 31;
    } else if (Long >= 9.0 && Long < 21.0) {
      zoneNum = 33;
    } else if (Long >= 21.0 && Long < 33.0) {
      zoneNum = 35;
    } else if (Long >= 33.0 && Long < 42.0) {
      zoneNum = 37;
    }
  }

  const LongOrigin = (zoneNum - 1) * 6 - 180 + 3; //+3 puts origin
  // in middle of
  // zone
  const LongOriginRad = degToRad(LongOrigin);

  const eccPrimeSquared = eccSquared / (1 - eccSquared);

  const N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  const T = Math.tan(LatRad) * Math.tan(LatRad);
  const C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  const A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  const M =
    a *
    ((1 - eccSquared / 4 - (3 * eccSquared * eccSquared) / 64 - (5 * eccSquared * eccSquared * eccSquared) / 256) *
      LatRad -
      ((3 * eccSquared) / 8 + (3 * eccSquared * eccSquared) / 32 + (45 * eccSquared * eccSquared * eccSquared) / 1024) *
        Math.sin(2 * LatRad) +
      ((15 * eccSquared * eccSquared) / 256 + (45 * eccSquared * eccSquared * eccSquared) / 1024) *
        Math.sin(4 * LatRad) -
      ((35 * eccSquared * eccSquared * eccSquared) / 3072) * Math.sin(6 * LatRad));

  const UTMEasting =
    k0 *
      N *
      (A +
        ((1 - T + C) * A * A * A) / 6.0 +
        ((5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A) / 120.0) +
    500000.0;

  let UTMNorthing =
    k0 *
    (M +
      N *
        Math.tan(LatRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24.0 +
          ((61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A) / 720.0));
  if (Lat < 0.0) {
    UTMNorthing += 10000000.0; //10000000 meter offset for
    // southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNum: zoneNum,
    zoneLetter: getLetterDesignator(Lat),
  };
}

/**
 * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
 * class where the Zone can be specified as a single string eg."60N" which
 * is then broken down into the zoneNum and ZoneLetter.
 *
 * @private
 * @param {object} utm An object literal with northing, easting, zoneNum
 *     and zoneLetter properties. If an optional accuracy property is
 *     provided (in meters), a bounding box will be returned instead of
 *     latitude and longitude.
 * @return {object} An object literal containing either lat and lon values
 *     (if no accuracy was provided), or top, right, bottom and left values
 *     for the bounding box calculated according to the provided accuracy.
 *     Returns null if the conversion failed.
 */
export function UTMtoDD(UTM: UTMType): { lat: number; lon: number } {
  const UTMNorthing = UTM.northing;
  const UTMEasting = UTM.easting;
  const zoneLetter = UTM.zoneLetter;
  const zoneNum = UTM.zoneNum;

  const k0 = 0.9996;
  const a = 6378137.0; //ellip.radius;
  const eccSquared = 0.00669438; //ellip.eccsq;
  const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));

  // remove 500,000 meter offset for longitude
  const x = UTMEasting - 500000.0;
  let y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (zoneLetter !== "N") {
    y -= 10000000.0; // remove 10,000,000 meter offset used
    // for southern hemisphere
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  const LongOrigin = (zoneNum - 1) * 6 - 180 + 3; // +3 puts origin
  // in middle of
  // zone

  const eccPrimeSquared = eccSquared / (1 - eccSquared);

  const M = y / k0;
  const mu =
    M /
    (a * (1 - eccSquared / 4 - (3 * eccSquared * eccSquared) / 64 - (5 * eccSquared * eccSquared * eccSquared) / 256));

  const phi1Rad =
    mu +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu);

  const N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  const R1 = (a * (1 - eccSquared)) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  const D = x / (N1 * k0);

  let lat =
    phi1Rad -
    ((N1 * Math.tan(phi1Rad)) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D) / 720);
  lat = radToDeg(lat);

  let lon =
    (D -
      ((1 + 2 * T1 + C1) * D * D * D) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D) / 120) /
    Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  const result = {
    lat: lat,
    lon: lon,
  };
  return result;
}
function getLetterDesignator(lat: number) {
  //This is here as an error flag to show that the Latitude is
  //outside MGRS limits
  let LetterDesignator = "Z";

  if (84 >= lat && lat >= 72) {
    LetterDesignator = "X";
  } else if (72 > lat && lat >= 64) {
    LetterDesignator = "W";
  } else if (64 > lat && lat >= 56) {
    LetterDesignator = "V";
  } else if (56 > lat && lat >= 48) {
    LetterDesignator = "U";
  } else if (48 > lat && lat >= 40) {
    LetterDesignator = "T";
  } else if (40 > lat && lat >= 32) {
    LetterDesignator = "S";
  } else if (32 > lat && lat >= 24) {
    LetterDesignator = "R";
  } else if (24 > lat && lat >= 16) {
    LetterDesignator = "Q";
  } else if (16 > lat && lat >= 8) {
    LetterDesignator = "P";
  } else if (8 > lat && lat >= 0) {
    LetterDesignator = "N";
  } else if (0 > lat && lat >= -8) {
    LetterDesignator = "M";
  } else if (-8 > lat && lat >= -16) {
    LetterDesignator = "L";
  } else if (-16 > lat && lat >= -24) {
    LetterDesignator = "K";
  } else if (-24 > lat && lat >= -32) {
    LetterDesignator = "J";
  } else if (-32 > lat && lat >= -40) {
    LetterDesignator = "H";
  } else if (-40 > lat && lat >= -48) {
    LetterDesignator = "G";
  } else if (-48 > lat && lat >= -56) {
    LetterDesignator = "F";
  } else if (-56 > lat && lat >= -64) {
    LetterDesignator = "E";
  } else if (-64 > lat && lat >= -72) {
    LetterDesignator = "D";
  } else if (-72 > lat && lat >= -80) {
    LetterDesignator = "C";
  }
  return LetterDesignator;
}

/**
 * Conversion from degrees to radians.
 *
 * @private
 * @param {number} deg the angle in degrees.
 * @return {number} the angle in radians.
 */
function degToRad(deg: number) {
  return deg * (Math.PI / 180.0);
}

/**
 * Conversion from radians to degrees.
 *
 * @private
 * @param {number} rad the angle in radians.
 * @return {number} the angle in degrees.
 */
function radToDeg(rad: number) {
  return 180.0 * (rad / Math.PI);
}
