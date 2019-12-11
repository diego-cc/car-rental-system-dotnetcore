/**
 * RevenueChart.js
 */
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

/**
 * @typedef {Object} RevenueProps
 * @property {Array} data - contains the total revenue for each month/year
 */
/**
 * RevenueChart component - renders a bar chart with the total revenue recorded per month and year
 * @param {RevenueProps} props
 * @returns {*}
 * @constructor
 */
export const RevenueChart = props => {
  const CustomTooltip = ({payload, label, active}) => {
	if (active && payload) {
	  return (
		<div className="bg-light text-dark text-center p-2 border border-dark">
		  <p className="font-weight-bold">{label}</p>
		  <p>Revenue: <span
			className="text-success">{`$ ${Number.parseFloat(payload[0].value).toFixed(2)}`}</span>
		  </p>
		</div>
	  )
	}
	return null;
  };

  return (
	<ResponsiveContainer width="100%" height={300}>
	  <BarChart data={props.data}>
		<CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
		<XAxis dataKey="monthAndYear"/>
		<YAxis/>
		<Tooltip content={<CustomTooltip/>}/>
		<Legend/>
		<Bar dataKey="revenue" barSize={20} fill="#8884d8"/>
	  </BarChart>
	</ResponsiveContainer>
  );
};
