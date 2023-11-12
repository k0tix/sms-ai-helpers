const apiUrl = "http://localhost:8080";
const headers = {
  Apikey: "oskariPoju23",
};

export const apiRequest = async (
  url: string,
  method: string,
  body?: any,
  text?: boolean
) => {
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  const data = text ? await response.text() : await response.json();
  return data;
};

export const summarizeUrls = async (
  urls: string[],
  phoneNumber: string,
  smsAuth: string // user:password
): Promise<string> => {
  const responseJson = await apiRequest(
    apiUrl + "/summarizeUrls",
    "POST",
    {
      urls,
      phone: phoneNumber,
      smsAuth,
    },
    true
  );

  return responseJson;
};

export const getSummaryStatus = async (
  id: string
): Promise<{ id: string; status: "PENDING" | "DONE" | "SENT" }> => {
  const responseJson = await apiRequest(
    apiUrl + `/summarizeUrls?id=${id}`,
    "GET"
  );
  return responseJson;
};

export const getRandomFact = async (): Promise<string> => {
  const responseText = await apiRequest(
    apiUrl + "/randomfact",
    "GET",
    undefined,
    true
  );
  return responseText;
};

export const isBackendWorking = async () => {
  const responseText = await apiRequest(
    apiUrl + "/heartbeat",
    "GET",
    undefined,
    true
  );
  return responseText === "'yes'";
};
