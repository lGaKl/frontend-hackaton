import React from "react";
import { RadialChart as RVRadialChart, RadialChartPoint } from "react-vis";

interface RadialChartProps {
    data: { angle: number; label?: string; className?: string }[];
    width?: number;
    height?: number;
    onValueClick?: (datapoint: RadialChartPoint) => void;
    className?: string;
}

const RadialChart: React.FC<RadialChartProps> = ({
                                                     data,
                                                     width = 300,
                                                     height = 300,
                                                     onValueClick,
                                                     className = ""
                                                 }) => {
    const originalWarn = console.warn;
    console.warn = (message: string) => {
        if (!message.includes("Support for defaultProps will be removed from function components")) {
            originalWarn(message);
        }
    };

    const chart = (
        <RVRadialChart
            data={data}
            width={width}
            height={height}
            onValueClick={onValueClick}
            className={`${className} animated-chart`}
            showLabels
            labelsRadiusMultiplier={0.9}
            labelsStyle={{ fontSize: width / 20, fill: '#222', fontWeight: 'bold', textAnchor: 'middle' }}
        />
    );

    console.warn = originalWarn;
    return chart;
};

export default RadialChart;