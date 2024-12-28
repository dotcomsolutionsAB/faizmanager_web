import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';  // Make sure this import is at the top

const PieChartComponent = ({ data }) => {
  const percentageNotTaking = (data.notTaking / data.total) * 100;

  const pieData = [
    { name: 'Taking Thaali', value: data.total - data.notTaking },
    { name: 'Not Taking', value: data.notTaking },
  ];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        outerRadius={120}
        fill="#8884d8"
        label
      >
        <Cell fill="#82ca9d" />
        <Cell fill="#ff8042" />
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
