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
  console.log(smsAuth);
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
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const fact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
  return fact;

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

export const randomFacts = [
  "The average person spends 1 hour and 42 minutes on social media every day.",
  "The first computer mouse was invented by Doug Engelbart in around 1964 and was made of wood.",
  "The first ever VCR, which was made in 1956, was the size of a piano!",
  "The first ever hard disk drive was made in 1979, and could hold only 5MB of data.",
  "The first online shopping transaction was a Sting CD sold by US retailer NetMarket on 11 August 1994.",
  "Did you know that the first ever domain name registered was Symbolics.com?",
  "The first ever email was sent in 1971 by Ray Tomlinson to himself.",
  "The first ever website was published on 6 August 1991 by British physicist Tim Berners-Lee.",
  "The first ever webcam was used at Cambridge University to monitor a coffee pot.",
  "The first ever text message was sent in 1992.",
  "The first ever call made on a handheld mobile phone was on 3 April 1973 by Motorola employee Martin Cooper.",
  "The first ever SMS message was sent in 1992.",
  "The first ever picture uploaded on the web was posted by Tim Berners-Lee (in 1992).",
  "The first ever YouTube video was uploaded on 23 April 2005.",
];
