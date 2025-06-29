import React from "react";
import SVGIcon from "../SVGIcon";
import CustomIcon from "./CustomIcon";

type Props = {
  tooltip: string;
  iconId: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

const Button: React.FC<Props> = ({
  tooltip,
  onClick,
  iconId,
  disabled,
  selected,
  children,
  icon,
}) => {
  // const style: CSSProperties = { userSelect: "none" };
  return (
    <div
      className="fortune-toolbar-button fortune-toolbar-item"
      onClick={onClick}
      tabIndex={0}
      data-tips={tooltip}
      role="button"
      aria-label={tooltip}
      style={selected ? { backgroundColor: "#E7E5EB" } : {}}
    >
    {icon?<CustomIcon  content={icon} />
        :<SVGIcon name={iconId} style={disabled ? { opacity: 0.3 } : {}} />}
      {tooltip && <div className="fortune-tooltip">{tooltip}</div>}
      {children}
    </div>
  );
};

export default Button;
