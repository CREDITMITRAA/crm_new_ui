function CustomTick({ x, y, payload }){
  const nameParts = payload.value.split(" "); // Split name if needed
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="end" // Center align the text
        fontSize="10"
        fill="#32086D"
        dy={5} // Move text closer to the bar
        dx={0} // Ensure it's centered over the bar
        transform="rotate(-60, 0, 0)" // Tilt text for readability
      >
        <tspan fill="#464646">{payload.value}</tspan>
        {/* {nameParts.length > 1 && (
          <>
            <tspan fill="#C4C4C4"> - </tspan>
            <tspan fill="#6B7280">{nameParts.slice(1).join(" ")}</tspan>
          </>
        )} */}
      </text>
    </g>
  );
};

export default CustomTick