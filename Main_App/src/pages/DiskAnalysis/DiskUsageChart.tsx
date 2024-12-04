import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DiskUsageChartProps {
    data: { name: string; value: number; formattedValue: string }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FC6C85', '#FF6347', '#FFD700', '#20B2AA'];

const CustomTooltip = ({ payload }: any) => {
    if (payload && payload.length > 0) {
        const { name, formattedValue } = payload[0].payload;
        return (
            <div style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #ccc', borderRadius: '10px' }}>
                <p style={{ margin: 0 }}><strong>{name}</strong></p>
                <p style={{ margin: 0 }}>{formattedValue}</p>
            </div>
        );
    }
    return null;
};

const DiskUsageChart: React.FC<DiskUsageChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill='rgba(0, 0, 0, 0.7)'
                    isAnimationActive={false}
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DiskUsageChart;
