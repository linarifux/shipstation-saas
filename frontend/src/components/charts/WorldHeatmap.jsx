import { ResponsiveChoropleth } from '@nivo/geo'
import worldFeatures from './world_countries.json' // geojson file

export default function WorldHeatmap() {
    // Replace with real API data
    const data = [
        { id: 'USA', value: 540 },
        { id: 'GBR', value: 320 },
        { id: 'CAN', value: 210 },
        { id: 'AUS', value: 180 },
        { id: 'DEU', value: 140 },
        { id: 'FRA', value: 120 },
        { id: 'ITA', value: 95 },
        { id: 'NLD', value: 82 },
        { id: 'ESP', value: 75 },
        { id: 'SGP', value: 60 },
    ];

    return (
        <div
            className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow"
            style={{ height: 450 }}
        >
            <h3 className="text-sm font-semibold text-slate-200 mb-6">
                World Shipment Heatmap
            </h3>

            <ResponsiveChoropleth
                data={data}
                features={worldFeatures.features}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                colors={[
                    '#0f172a',
                    '#0e7490',
                    '#06b6d4',
                    '#38bdf8',
                    '#7dd3fc',
                    '#bae6fd',
                ]}
                domain={[0, 600]}
                unknownColor="#1e293b"
                label="properties.name"
                valueFormat=".0f"
                projectionScale={110}
                projectionTranslation={[0.5, 0.55]}
                borderWidth={0.4}
                borderColor="#334155"
                legends={[
                    {
                        anchor: 'bottom-left',
                        direction: 'column',
                        translateX: 20,
                        translateY: -30,
                        itemWidth: 90,
                        itemHeight: 18,
                        itemsSpacing: 4,
                        itemDirection: 'left-to-right',
                        itemTextColor: '#94a3b8',
                        symbolSize: 18,
                    },
                ]}
                theme={{
                    textColor: '#e2e8f0',
                    background: 'transparent',
                    tooltip: {
                        container: {
                            background: '#0f172a',
                            color: '#e2e8f0',
                            borderRadius: '8px',
                            border: '1px solid #334155',
                        },
                    },
                }}
            />
        </div>
    );
}
