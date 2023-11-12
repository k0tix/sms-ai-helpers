import { useEffect, useState } from "react";
import "./App.css";
import { DOMMessageResponse } from "./types";
import {
  Button,
  Card,
  Container,
  Input,
  Spacer,
  Text,
} from "@nextui-org/react";
import { MdOutlinePhone, MdOutlineSettings } from "react-icons/md";
import Monkey from "./Monkey";
import validator from "validator";
import Typewriter, { Typewriters } from "./Typewriter";
import SettingsModal from "./settings/Settings";
import { isBackendWorking, summarizeUrls } from "./api";
import { getTabsUrls } from "./utils";
import { useSettings } from "./settings/hooks";

function App() {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberInvalid, setPhoneNumberInvalid] = useState<boolean>(false);
  const [isCrunchingSummary, setIsCrunchingSummary] = useState<boolean>(false);
  const [isBackendRunning, setIsBackendRunning] = useState<boolean>(true);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const { settings } = useSettings();
  const [currentEventId, setCurrentEventId] = useState<string>("");

  const handler = () => setSettingsVisible(true);
  const closeHandler = () => {
    setSettingsVisible(false);
    console.log("closed");
  };

  const readPhoneNumber = () => {
    chrome.storage.sync.get(["phoneNumber"], (result) => {
      console.log("Value currently is " + result.phoneNumber);
      setPhoneNumber(result.phoneNumber);
    });
  };

  const checkIsBackendRunning = async () => {
    const isWorking = await isBackendWorking();
    setIsBackendRunning(isWorking);
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

  useEffect(() => {
    checkIsBackendRunning();
    readPhoneNumber();
    getTabsUrls().then((urls) => {
      console.log(urls);
    });
    console.log(settings);
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
        <Text
          h2
          css={{
            textGradient: "45deg, $purple600 -20%, $pink600 100%",
            margin: 0,
          }}
          weight="bold"
        >
          SMSummarizer
        </Text>

        <Button
          auto
          shadow
          color="error"
          icon={<MdOutlineSettings size={18} />}
          onPress={handler}
        />
      </div>

      {!isBackendRunning && <Text color="error">BACKEND NOT WORKING!!!</Text>}

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
            alignItems: "center",
          }}
        >
          <Input
            style={{ width: "225px" }}
            size="xl"
            type="tel"
            bordered
            animated
            clearable
            labelPlaceholder="Phone number"
            contentLeft={<MdOutlinePhone size={24} />}
            value={phoneNumber}
            onChange={(event) => {
              savePhoneNumber(event.target.value);
            }}
          />
        </div>

        <Spacer y={0.5} />
        <Button
          shadow
          animated
          style={{ width: "100%", fontSize: 16, fontWeight: "bold" }}
          disabled={
            phoneNumberInvalid ||
            phoneNumber === undefined ||
            phoneNumber === ""
          }
          size="lg"
          onPress={async () => {
            if (!phoneNumber || !settings?.apiUser || !settings?.apiPassword)
              return;

            setIsCrunchingSummary(true);
            const urls = await getTabsUrls();
            // const eventId = await summarizeUrls(
            //   urls,
            //   phoneNumber,
            //   `${settings.apiUser}:${settings.apiPassword}`
            // );

            // setCurrentEventId(eventId);

            // wait 5 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));
            setIsCrunchingSummary(false);
          }}
        >
          {phoneNumberInvalid || phoneNumber === undefined || phoneNumber === ""
            ? "We need your phone number 🥺"
            : "Send summary 🚀"}
        </Button>
      </div>
      <Spacer y={1} />
      <SettingsModal
        settingsVisible={settingsVisible}
        closeHandler={closeHandler}
      />
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
