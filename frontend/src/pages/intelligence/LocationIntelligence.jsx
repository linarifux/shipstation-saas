import { useEffect, useState } from "react";
import axios from "axios";

import SmartPinMap from "./components/SmartPinMap";
import CityRanking from "./components/CityRanking";
import RecommendBox from "./components/RecommendBox";

// ✅ IMPORT METRICS
import {
    groupOrdersByCity,
    getBestLocation
} from "./components/metrics";
import { HashLoader } from "react-spinners";

export default function LocationIntelligence() {
    const [shipments, setShipments] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [cities, setCities] = useState([]);
    const [bestLocation, setBestLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const s = await axios.get("http://localhost:5000/shipments");
            const w = await axios.get("http://localhost:5000/warehouses");

            const shipments = s.data.shipments || [];
            const warehouses = w.data.warehouses || [];

            setShipments(shipments);
            setWarehouses(warehouses);

            // ✅ USE METRICS.JS HERE
            const groupedCities = groupOrdersByCity(shipments);

            setCities(groupedCities);

            const best = getBestLocation(groupedCities);
            setBestLocation(best);

        } catch (err) {
            console.error("Intelligence load error:", err);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="justify-center flex flex-col items-center py-20">
                <HashLoader size={50} color="#38bdf8" />
            </div>
        )
    }



    return (
        <div className="p-6 text-slate-100">

            <h1 className="text-3xl font-bold mb-6 text-black">
                📍 Warehouse Placement Intelligence
            </h1>

            <SmartPinMap
                cities={cities}
                warehouses={warehouses}
                bestLocation={bestLocation}
            />

            <div className="grid md:grid-cols-2 gap-6 mt-8">

                <CityRanking cities={cities} />

                <RecommendBox location={bestLocation} />

            </div>

        </div>
    );
}
