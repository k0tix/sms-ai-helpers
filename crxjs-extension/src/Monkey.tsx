import { Card, Image } from "@nextui-org/react";
import hold from "./images/chimp.gif";
import idle from "./images/chimp-yes.gif";
import buysell from "./images/chimp-spin.gif";
import Typewriter from "./Typewriter";

export type MonkeyType = "hold" | "idle" | "buysell";

type MessageProps = {
  message: React.ReactNode;
  type: MonkeyType;
};

const monkeyTypeToPath = (type: MonkeyType): string => {
  if (type === "hold") {
    return hold;
  }

  if (type === "idle") {
    return idle;
  }

  if (type === "buysell") {
    return buysell;
  }

  return hold;
};

const monkeyWidthHeight: Record<MonkeyType, { width: number; height: number }> =
  {
    buysell: { height: 150, width: 150 },
    hold: { height: 120, width: 120 },
    idle: { height: 100, width: 100 },
  };

export default function Monkey({ message, type }: MessageProps) {
  return (
    <div
      style={{
        height: 100,
        width: "90%",
      }}
    >
      {message}

      <Image
        src={monkeyTypeToPath(type)}
        alt="me"
        width={monkeyWidthHeight[type].width}
        height={monkeyWidthHeight[type].height}
      />
    </div>
  );
}
