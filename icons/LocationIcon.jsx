import React from "react";
import { Svg, Path } from "react-native-svg";

export default function LocationIcon({ size = 30, color = "#007bff" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12 2C8.686 2 6 4.686 6 8C6 12.971 12 21 12 21C12 21 18 12.971 18 8C18 4.686 15.314 2 12 2ZM12 11C10.895 11 10 10.105 10 9C10 7.895 10.895 7 12 7C13.105 7 14 7.895 14 9C14 10.105 13.105 11 12 11Z"
        fill={color}
      />
    </Svg>
  );
}
