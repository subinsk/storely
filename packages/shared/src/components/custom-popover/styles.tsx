import type { FC } from "react";
import { styled, alpha } from "@mui/material/styles";
import { bgBlur } from "../../theme/css";
import type { StyledComponent } from "@emotion/styled";

// ----------------------------------------------------------------------

interface StyledArrowProps {
  arrow: string;
}

const SIZE = 14;
const POSITION = -(SIZE / 2) + 0.5;

export const StyledArrow: StyledComponent<any, StyledArrowProps, any> = styled("span")<StyledArrowProps>`
  width: ${SIZE}px;
  height: ${SIZE}px;
  position: absolute;
  border-bottom-left-radius: ${SIZE / 4}px;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  border: solid 1px ${({ theme }) => alpha(
    theme?.palette?.mode === "light"
      ? theme?.palette?.grey?.[500] ?? '#ccc'
      : theme?.palette?.common?.black ?? '#000',
    0.12
  )};
  
  ${({ theme }) => {
    const blurStyles = bgBlur({
      color: theme?.palette?.background?.paper ?? '#fff',
      opacity: 0.9
    });
    
    return Object.entries(blurStyles).map(([key, value]) => 
      typeof value === 'object' 
        ? `${key}: { ${Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('; ')} }`
        : `${key}: ${value}`
    ).join('; ');
  }}

  ${({ arrow }) => {
    if (arrow?.startsWith("top")) {
      return `
        top: ${POSITION}px;
        transform: rotate(135deg);
      `;
    }
    if (arrow?.startsWith("bottom")) {
      return `
        bottom: ${POSITION}px;
        transform: rotate(-45deg);
      `;
    }
    if (arrow?.startsWith("left")) {
      return `
        left: ${POSITION}px;
        transform: rotate(45deg);
      `;
    }
    if (arrow?.startsWith("right")) {
      return `
        right: ${POSITION}px;
        transform: rotate(-135deg);
      `;
    }
    return '';
  }}

  ${({ arrow }) => {
    if (arrow?.endsWith("left")) {
      return 'left: 20px;';
    }
    if (arrow?.endsWith("center")) {
      return 'left: 0; right: 0; margin: auto;';
    }
    if (arrow?.endsWith("right")) {
      return 'right: 20px;';
    }
    if (arrow?.endsWith("top")) {
      return 'top: 20px;';
    }
    if (arrow?.endsWith("bottom")) {
      return 'bottom: 20px;';
    }
    return '';
  }}
`;
