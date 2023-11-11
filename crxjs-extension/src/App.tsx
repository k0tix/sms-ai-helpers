import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DOMMessageResponse } from "./types";
import {
  Button,
  Card,
  Container,
  Input,
  Spacer,
  Switch,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlinePhone,
} from "react-icons/md";
import Monkey from "./Monkey";
import validator from "validator";
import Typewriter, { Typewriters } from "./Typewriter";

function App() {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberInvalid, setPhoneNumberInvalid] = useState<boolean>(false);

  const [isCrunchingSummary, setIsCrunchingSummary] = useState<boolean>(false);

  const readPhoneNumber = () => {
    chrome.storage.sync.get(["phoneNumber"], (result) => {
      console.log("Value currently is " + result.phoneNumber);
      setPhoneNumber(result.phoneNumber);
    });
  };

  const savePhoneNumber = (number: string) => {
    if (number.length > 0 && !validator.isMobilePhone(number)) {
      setPhoneNumberInvalid(true);
    } else {
      setPhoneNumberInvalid(false);
    }

    setPhoneNumber(number);
    chrome.storage.sync.set({ phoneNumber: number }, () => {
      console.log("Value is set to " + number);
    });
  };

  const getTabsUrls = async () => {
    const tabs = await chrome.tabs.query({});
    const urls = tabs
      .filter((tab) => tab.url !== undefined && tab.url.startsWith("http"))
      .map((tab) => tab.url);
    return urls;
  };

  useEffect(() => {
    readPhoneNumber();
    getTabsUrls().then((urls) => {
      console.log(urls);
    });
  }, []);

  return (
    <Container>
      <Spacer y={1} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>SMSummarizer</h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isDark ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
          <Spacer x={0.5} />
          <Switch
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </div>
      </div>
      <Spacer y={1} />

      <Monkey
        message={
          isCrunchingSummary ? <CrunchingSummaryMessage /> : <DefaultMessage />
        }
        type={isCrunchingSummary ? "buysell" : "idle"}
      />
      <Spacer y={12} />
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          maxWidth: 300,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          <Input
            size="xl"
            type="tel"
            bordered
            animated
            clearable
            labelPlaceholder="Phone"
            contentRight={<MdOutlinePhone />}
            value={phoneNumber}
            onChange={(event) => {
              savePhoneNumber(event.target.value);
            }}
          />
        </div>

        <Spacer y={0.5} />
        <Button
          style={{ width: "100%", fontSize: 16 }}
          disabled={
            phoneNumberInvalid ||
            phoneNumber === undefined ||
            phoneNumber === ""
          }
          size="lg"
          onPress={async () => {
            setIsCrunchingSummary(true);
            const urls = await getTabsUrls();
            console.log(urls);

            // wait 5 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));
            setIsCrunchingSummary(false);
          }}
        >
          {phoneNumberInvalid || phoneNumber === undefined || phoneNumber === ""
            ? "We need your phone number 🥺"
            : "Send"}
        </Button>
      </div>
      <Spacer y={1} />
    </Container>
  );
}

const DefaultMessage = () => (
  <Card
    style={{
      margin: "1em",
      padding: "1em",
    }}
    isHoverable
    variant="bordered"
  >
    <Typewriter
      text="Tired of looking through all your tabs? No worries. Our helpful
little buddy will summarize all of the necessary information and
send it straight to your phone"
      delay={30}
    />
  </Card>
);

const CrunchingSummaryMessage = () => (
  <Card
    style={{
      margin: "1em",
      padding: "1em",
    }}
    isHoverable
    variant="bordered"
  >
    <Typewriters
      texts={[
        "Crunching summary...",
        "Almost there...",
        "Just a sec...",
        "Finishing up...",
      ]}
      delay={30}
      textSwitchDelay={2000}
    />
  </Card>
);

export default App;
