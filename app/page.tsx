"use client";

import { FAQ } from "./components/faq";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getGeolocation } from "./actions";
import { GeolocationResult } from "./types";
import { MapPin, AlertTriangle, Globe, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const faqItems = [
    {
        id: "1",
        number: "01",
        title: "What API has used in this project?",
        content:
            "This project is built on top of IPStack API (https://ipstack.com) offered by APILayer. IPstack API converts any IP address to geolocation and provides more information such as secuity and availability.",
    },
    {
        id: "2",
        number: "02",
        title: "Is this free to use?",
        content:
            "Yes, IP to Location app is completely free to use as well as IPStack API. You can subscribe to IPStack paid plans we you want more functionalities.",
    },
    {
        id: "3",
        number: "03",
        title: "Can I get locations of multiple IP addresses at once?",
        content:
            "Yes, you can. This app calls the Bulk endpoint of IPStack that enables the application to get the geolocation of multiple IP addresses at once.",
    },
];
export default function Home() {
    const [results, setResults] = useState<GeolocationResult[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setResults(null);
        setExpandedIndex(null);

        const formData = new FormData(event.currentTarget);
        const result = await getGeolocation(formData);

        if ("error" in result) {
            setError(result.error);
        } else {
            setResults(result.results);
        }

        setIsLoading(false);
    };

    const isSuspicious = (countryName: string) => {
        const suspiciousCountries = ["North Korea", "Iran", "Syria"];
        console.log(suspiciousCountries.includes(countryName || ""));
        return suspiciousCountries.includes(countryName || "");
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[#1a1b1e] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                    <Globe className="w-8 h-8 text-purple-400 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-200">IP to Location</h1>
                </div>

                <Card className="bg-[#25262b] border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-800">
                        <CardTitle className="text-2xl font-bold text-gray-200">IP Geolocation Explorer</CardTitle>
                        <CardDescription className="text-gray-400">
                            Enter IP addresses to explore their locations.
                            <span className="block">
                                Check if an IP is suspicious and get access to a lot more details.
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                name="ips"
                                className="min-h-[200px] bg-[#1a1b1e] border-gray-800 text-gray-200 placeholder-gray-500 resize-none rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter IP addresses (one per line)"
                            />
                            <Button
                                type="submit"
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Globe className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? "Exploring..." : "Explore Geolocation"}
                            </Button>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {results && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    {results.map((result, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Card
                                                className={`bg-opacity-20 border-none shadow-lg cursor-pointer transition-all duration-300 ${
                                                    isSuspicious(result.country_name)
                                                        ? "bg-orange-500"
                                                        : "bg-purple-500"
                                                } ${expandedIndex === index ? "ring-2 ring-blue-500" : ""}`}
                                                onClick={() => toggleExpand(index)}
                                            >
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-lg font-medium text-gray-200 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {result.ip}
                                                        </div>
                                                        {expandedIndex === index ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <p className="text-gray-400">Country</p>
                                                            <p className="font-medium text-gray-200">
                                                                {result.country_name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400">Region</p>
                                                            <p className="font-medium text-gray-200">
                                                                {result.region_name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400">City</p>
                                                            <p className="font-medium text-gray-200">{result.city}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-400">Coordinates</p>
                                                            <p className="font-medium text-gray-200">
                                                                {result.latitude}, {result.longitude}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isSuspicious(result.country_name) && (
                                                        <div className="flex items-center gap-2 text-orange-300 text-sm">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            <span>Suspicious IP detected</span>
                                                        </div>
                                                    )}
                                                    {expandedIndex === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="mt-4 space-y-4"
                                                        >
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-400">Continent</p>
                                                                    <p className="font-medium text-gray-200">
                                                                        {result.continent_name}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">ZIP</p>
                                                                    <p className="font-medium text-gray-200">
                                                                        {result.zip || "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">Connection Type</p>
                                                                    <p className="font-medium text-gray-200">
                                                                        {result.connection_type || "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-400">ISP</p>
                                                                    <p className="font-medium text-gray-200">
                                                                        {result.connection.isp || "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-gray-400">Security Information</p>
                                                                <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                                                                    <li>
                                                                        Proxy: {result.security.is_proxy ? "Yes" : "No"}
                                                                    </li>
                                                                    <li>
                                                                        Crawler:{" "}
                                                                        {result.security.is_crawler ? "Yes" : "No"}
                                                                    </li>
                                                                    <li>
                                                                        Tor: {result.security.is_tor ? "Yes" : "No"}
                                                                    </li>
                                                                    <li>
                                                                        Threat Level: {result.security.threat_level}
                                                                    </li>
                                                                    {result.security.threat_types && (
                                                                        <li>
                                                                            Threat Types:{" "}
                                                                            {result.security.threat_types.join(", ")}
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                    <FAQ items={faqItems} />
                </Card>
            </div>
        </div>
    );
}
