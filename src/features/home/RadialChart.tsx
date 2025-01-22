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
                                                     className
                                                 }) => {
    return (
        <RVRadialChart
            data={data}
            width={width}
            height={height}
            onValueClick={onValueClick}
            className={`${className} animated-chart`}
        />
    );
};

export default RadialChart;