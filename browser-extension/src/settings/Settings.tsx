import {
  Button,
  Input,
  Modal,
  Row,
  Spacer,
  Switch,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { SettingsConfig, defaultSettings, useSettings } from "./hooks";

type SettingsModalProps = {
  settingsVisible: boolean;
  closeHandler: () => void;
};

const SettingsModal = ({
  settingsVisible,
  closeHandler,
}: SettingsModalProps) => {
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const { settings, saveSettings } = useSettings();

  return (
    <Modal
      style={{ width: "80%", margin: "auto" }}
      aria-labelledby="modal-title"
      open={settingsVisible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Configure your{" "}
          <Text
            b
            size={18}
            css={{ textGradient: "45deg, $purple600 -20%, $pink600 100%" }}
          >
            SMSummarizer
          </Text>
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text size={14} weight="bold">
          46elk credentials
        </Text>
        <Input
          bordered
          fullWidth
          color="primary"
          size="lg"
          aria-label="api user"
          labelLeft="user"
          value={settings?.apiUser || ""}
          onChange={(event) => {
            saveSettings({ ...settings, apiUser: event.target.value });
          }}
        />
        <Input.Password
          bordered
          fullWidth
          color="primary"
          size="lg"
          aria-label="api password"
          labelLeft="password"
          value={settings?.apiPassword || ""}
          onChange={(event) => {
            saveSettings({ ...settings, apiPassword: event.target.value });
          }}
        />
        <Spacer y={1} />
        <Row justify="space-between" align="center">
          {isDark ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
          <Text size={14} weight="bold">
            Dark mode
          </Text>
          <Spacer x={5} />

          <Switch
            aria-label="dark mode switch"
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </Row>
        <Row justify="space-between">
          <Text size={14} weight="bold">
            Get random facts while processing
          </Text>{" "}
          <Switch
            aria-label="random facts switch"
            checked={settings?.getRandomFacts || false}
            onChange={(e) => {
              saveSettings({ ...settings, getRandomFacts: e.target.checked });
            }}
          />
        </Row>
        <Input
          aria-label="hallucination score"
          onChange={(event) => {
            saveSettings({
              ...settings,
              hallucinationScore: Number(event.target.value),
            });
          }}
          value={settings?.hallucinationScore || 1}
          bordered
          type="number"
          min={0}
          max={100}
          label="Hallucination score (0-100)"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          color="success"
          onPress={() => {
            saveSettings(settings);
            closeHandler();
          }}
        >
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
