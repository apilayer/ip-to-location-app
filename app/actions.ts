"use server";

import { z } from "zod";
import { GeolocationResult } from "./types";
import { log } from "console";

const API_KEY = process.env.IPSTACK_API_KEY;

const GeolocationSchema = z.object({
    ip: z.string(),
    continent_name: z.string().nullable(),
    country_name: z.string().nullable(),
    region_name: z.string().nullable(),
    city: z.string().nullable(),
    zip: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    connection_type: z.string().nullable(),
    connection: z
        .object({
            isp: z.string().nullable(),
        })
        .nullable(),
    security: z
        .object({
            is_proxy: z.boolean().nullable(),
            is_crawler: z.boolean().nullable(),
            is_tor: z.boolean().nullable(),
            threat_level: z.string().nullable(),
            threat_types: z.array(z.string()).nullable(),
        })
        .nullable()
        .optional(),
});

export async function getGeolocation(
    formData: FormData
): Promise<{ results: GeolocationResult[] } | { error: string }> {
    const ips = formData.get("ips") as string;
    const ipList = ips
        .split("\n")
        .map((ip) => ip.trim())
        .filter(Boolean);

    if (ipList.length === 0) {
        return { error: "No valid IP addresses provided" };
    }

    if (ipList.length > 50) {
        return { error: "Maximum 50 IP addresses allowed at once" };
    }

    try {
        const response = await fetch(`http://api.ipstack.com/${ipList.join(",")}?access_key=${API_KEY}&security=1`);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();

        if ("success" in data && data.success === false) {
            return { error: data.error.info || "An error occurred while fetching data" };
        }

        let results: GeolocationResult[];

        if (Array.isArray(data)) {
            results = data.map(processGeolocationData).filter((item): item is GeolocationResult => item !== null);
        } else if (typeof data === "object" && data !== null) {
            results = [processGeolocationData(data)].filter((item): item is GeolocationResult => item !== null);
        } else {
            throw new Error("Unexpected API response format");
        }

        return { results };
    } catch (error) {
        console.error("API call error:", error);
        return { error: "Failed to fetch geolocation data. Please try again later." };
    }
}

function processGeolocationData(item: unknown): GeolocationResult | null {
    try {
        const validatedData = GeolocationSchema.parse(item);

        return {
            ...validatedData,
            continent_name: validatedData.continent_name || "Unknown",
            country_name: validatedData.country_name || "Unknown",
            region_name: validatedData.region_name || "Unknown",
            city: validatedData.city || "Unknown",
            zip: validatedData.zip || "Unknown",
            connection_type: validatedData.connection_type || "Unknown",
            latitude: validatedData.latitude ?? 0,
            longitude: validatedData.longitude ?? 0,
            connection: validatedData.connection
                ? {
                      isp: validatedData.connection.isp || "Unknown",
                  }
                : { isp: "Unknown" },
            security: validatedData.security
                ? {
                      is_proxy: validatedData.security.is_proxy ?? false,
                      is_crawler: validatedData.security.is_crawler ?? false,
                      is_tor: validatedData.security.is_tor ?? false,
                      threat_level: validatedData.security.threat_level || "Unknown",
                      threat_types: validatedData.security.threat_types || [],
                  }
                : {
                      is_proxy: false,
                      is_crawler: false,
                      is_tor: false,
                      threat_level: "Unknown",
                      threat_types: [],
                  },
        };
    } catch (error) {
        console.error("Validation error:", error);
        return null;
    }
}
