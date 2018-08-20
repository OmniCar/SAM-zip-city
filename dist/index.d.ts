export declare type Country = 'DK' | 'SE';
export interface IZipCodes {
    [key: string]: string;
}
export declare type ZipCodeMap = {
    [key in Country]?: IZipCodes;
};
export interface ICityLookup {
    zipcode: number | string;
    country: Country;
    fileLocation?: string;
    global?: any;
}
export declare type CityConf = Pick<ICityLookup, 'country' | 'fileLocation' | 'global'>;
export declare const getCityFromZip: (cityLookup: ICityLookup) => Promise<string | false>;
export declare const initZipCityCountry: (cityLookup: Pick<ICityLookup, "country" | "fileLocation" | "global">) => Promise<IZipCodes | undefined>;
