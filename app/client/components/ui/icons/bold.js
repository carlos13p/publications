// @flow
import React from "react";

type IconProps = {
  size?: number,
  color?: string,
};
export default ({ size, color }: IconProps) => (
  <svg
    width={size || 16}
    height={size || 16}
    viewBox="0 0 16 16"
    fillRule="nonzero"
  >
    <path
      fill={color || "black"}
      d="M12.308 8c1.309-.768 2.462-2.052 2.462-3.599C14.769 2.006 13.026 0 10.462 0H1.231v16h9.231c2.565 0 4.308-2.006 4.308-4.401-.001-1.547-1.154-2.831-2.462-3.599zm-4.101 6h-3V9h3c1.49 0 2.5 1.103 2.5 2.526 0 1.424-1.01 2.474-2.5 2.474zm0-7h-3V2h3c1.49 0 2.5 1.103 2.5 2.526C10.707 5.95 9.697 7 8.207 7z"
    />
  </svg>
);
