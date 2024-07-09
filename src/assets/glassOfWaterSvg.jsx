import * as React from "react"
import Svg, { Path } from "react-native-svg"
const GlassOfWaterSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={40}
    height={40}
    viewBox="0 0 512 512"
    {...props}
  >
    <Path
      d="M416 512H96L48 0h416z"
      style={{
        fill: "#f2f2f4",
      }}
    />
    <Path
      d="M254.4 0v512H416L464 0z"
      style={{
        fill: "#dfdfe1",
      }}
    />
    <Path
      d="m63 160 33 352h320l33-352z"
      style={{
        fill: "#98c8ed",
      }}
    />
    <Path
      d="M256 160v352h160l33-352z"
      style={{
        fill: "#7ab9e8",
      }}
    />
  </Svg>
)

export default GlassOfWaterSvg;