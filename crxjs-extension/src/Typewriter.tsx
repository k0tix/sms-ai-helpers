import { useState, useEffect } from "react";

type TypewriterProps = {
  text: string;
  delay: number;
};

const Typewriter = ({ text, delay }: TypewriterProps) => {
  const [currentText, setCurrentText] = useState("\u200B");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

type TypewritersProps = {
  texts: string[];
  delay: number;
  textSwitchDelay: number;
};

export const Typewriters = ({
  texts,
  delay,
  textSwitchDelay,
}: TypewritersProps) => {
  const [currentText, setCurrentText] = useState("\u200B");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < texts[currentTextIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentText(
          (prevText) => prevText + texts[currentTextIndex][currentIndex]
        );
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentText("\u200B");
        setCurrentIndex(0);
        setCurrentTextIndex(
          (prevTextIndex) => (prevTextIndex + 1) % texts.length
        );
      }, textSwitchDelay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, texts, currentTextIndex]);

  return <span>{currentText}</span>;
};

export default Typewriter;
