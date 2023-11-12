export const getTabsUrls = async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
  });
  const urls = tabs
    .filter(
      (tab) =>
        tab.url !== undefined &&
        tab.url.startsWith("https") &&
        !tab.url.includes("chrome-extension://") &&
        !tab.url.includes("localhost") &&
        !tab.url.includes("stackoverflow.com")
    )
    .map((tab) => tab.url as string)
    .slice(0, 5);
  return urls;
};
