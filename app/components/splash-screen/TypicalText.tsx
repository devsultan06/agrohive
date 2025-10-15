import React, { useState, useEffect } from "react";
import { Text } from "react-native";

type TypicalTextProps = {
  text: string;
  speed?: number;
  style?: object;
  onComplete?: () => void;
};

export const TypicalText = ({
  text,
  speed = 200,
  style,
  onComplete,
}: TypicalTextProps) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval); // stop interval
        onComplete?.(); // call completion callback
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <Text style={style}>{displayed}</Text>;
};
