import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SettingsProvider } from "./settings/hooks";

const lightTheme = createTheme({
  type: "light",
});

const darkTheme = createTheme({
  type: "dark",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </NextUIProvider>
    </NextThemesProvider>
  </React.StrictMode>
);

// (async () => {
//   const fetchTabDOM = "document.documentElement.innerHTML";
//   const urls = (await chrome.tabs.query({})).map((tab) => tab.url);
//   const results: any = [];
//   for (const url of urls) {
//     await new Promise<void>((resolve) => {
//       chrome.tabs.update({ url, active: true }, (tab) => {
//         if (tab?.id === undefined) return;
//         chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
//           if (tabId === tab.id && info.status === "complete") {
//             chrome.tabs.onUpdated.removeListener(onUpdated);
//             chrome.tabs.sendMessage(
//               tabId,
//               { type: "GET_DOM" },
//               (response: DOMMessageResponse) => {
//                 if (response?.content !== undefined) {
//                   results.push(response);
//                 }
//                 resolve();
//               }
//             );
//           }
//         });
//       });
//     });
//   }
//   console.log(results);
//   setContent(results);
// })();
// try {
//   chrome.tabs &&
//     chrome.tabs.query(
//       {
//         active: true,
//         currentWindow: true,
//       },
//       (tabs) => {
//         console.log(tabs);
//         /**
//          * Sends a single message to the content script(s) in the specified tab,
//          * with an optional callback to run when a response is sent back.
//          *
//          * The runtime.onMessage event is fired in each content script running
//          * in the specified tab for the current extension.
//          */
//         // chrome.tabs.sendMessage(
//         //   tabs[0].id || 0,
//         //   { type: "GET_DOM" },
//         //   (response: DOMMessageResponse) => {
//         //     console.log(response);
//         //     setTitle(response.title);
//         //     setContent(response.content);
//         //   }
//         // );
//       }
//     );
// } catch (error) {
//   console.log(error);
// }
