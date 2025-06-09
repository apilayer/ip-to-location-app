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
