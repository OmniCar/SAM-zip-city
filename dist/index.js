var _this = this;
import * as tslib_1 from "tslib";
import { loadScript } from './loadScript';
var zipcodeCache = {};
export var getCityFromZip = function (cityLookup) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var zipcode, countryMap, zipKey, cityName;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zipcode = tslib_1.__assign({}, cityLookup).zipcode;
                return [4 /*yield*/, initZipCityCountry(cityLookup)];
            case 1:
                countryMap = _a.sent();
                if (!countryMap) {
                    return [2 /*return*/, false];
                }
                zipKey = ("" + zipcode).replace(' ', '');
                cityName = countryMap.hasOwnProperty(zipKey) ? countryMap[zipKey] : false;
                return [2 /*return*/, cityName];
        }
    });
}); };
var defaultFileLocation = 'https://cdn.jsdelivr.net/gh/omnicar/sam-zip-city/dist/countries/';
export var initZipCityCountry = function (cityLookup) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var country, _a, fileLocation, global, myGlobal, zipcodeCountryMap, scriptPath;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                country = cityLookup.country, _a = cityLookup.fileLocation, fileLocation = _a === void 0 ? defaultFileLocation : _a, global = cityLookup.global;
                if (zipcodeCache[country]) {
                    return [2 /*return*/, zipcodeCache[country]];
                }
                myGlobal = global || window;
                zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, country);
                if (zipcodeCountryMap) {
                    return [2 /*return*/, zipcodeCountryMap];
                }
                scriptPath = "" + fileLocation + country.toLowerCase() + ".js";
                return [4 /*yield*/, loadScript(scriptPath, "zipCity-" + country)
                    // Check again if the variable is available
                ];
            case 1:
                _b.sent();
                // Check again if the variable is available
                zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, country);
                if (zipcodeCountryMap) {
                    return [2 /*return*/, zipcodeCountryMap];
                }
                return [2 /*return*/, undefined];
        }
    });
}); };
var getZipcodeMapFromGlobal = function (global, country) {
    var zipcodeCountryMap = global["zipcodeMap" + country];
    if (zipcodeCountryMap) {
        zipcodeCache[country] = zipcodeCountryMap;
        return zipcodeCountryMap;
    }
};
