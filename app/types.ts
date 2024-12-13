export interface GeolocationResult {
    ip: string;
    continent_name: string;
    country_name: string;
    region_name: string;
    city: string;
    zip: string;
    latitude: number;
    longitude: number;
    connection_type: string;
    connection: {
        isp: string;
    };
    security: {
        is_proxy: boolean;
        is_crawler: boolean;
        is_tor: boolean;
        threat_level: string;
        threat_types?: string[];
    };
}
