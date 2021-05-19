import { createContext } from "react";

export const themes = {
  light: {
    type: "light",
    background: "#dbf6e9",
    primaryColor: "#21c961",
    secondaryColor: "#accfc0",
    fontColor: "#1b2021",
    bubbleSend: "#f3f4ed",
    bubbleReceived: "#c8eed9",
    backgroundColors: [
      "#21c961",
      "#0A7D36",
      "#332D03",
      "#007580",
      "#7D0600",
      "#FF0D00",
      "#000",
      "#4F3D23",
      "#9C6C25",
    ],
  },
  dark: {
    type: "dark",
    background: "#223c4e",
    primaryColor: "#007580",
    secondaryColor: "#376268",
    fontColor: "#feffde",
    bubbleSend: "#903749",
    bubbleReceived: "#343f56",
    backgroundColors: [
      "#800D4F",
      "#35719C",
      "#547E9C",
      "#9C6C25",
      "#4F3D23",
      "#000",
      "#14BDCC",
      "#331500",
      "#CC5500",
    ],
  },
};

export const ThemeContext = createContext(themes.light);
