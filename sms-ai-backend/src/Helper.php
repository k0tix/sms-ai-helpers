<?php

declare(strict_types=1);

class Helper
{
    private const allowedPhones = [
        //add numbers that can be sent to
    ];
    public static function cleanupUrlData(string $data): string
    {
        $dom = new DOMDocument;
        libxml_use_internal_errors(true);
        $dom->loadHTML($data);
        libxml_use_internal_errors(false);

        foreach(["style", "script", "link", "footer"] as $elem) {
            $list = $dom->getElementsByTagName($elem);
            while ($list->length > 0) {
                $p = $list->item(0);
                $p->parentNode->removeChild($p);
            }
        }
        $text = "";
        $list = $dom->getElementsByTagName("div");
        while ($list->length > 0) {
            $p = $list->item(0);
            $text .= $p->textContent;
            $p->parentNode->removeChild($p);
        }
        $stringbody = preg_replace("/[\n\t]/", '', $text);
        return strip_tags($stringbody);
    }
    public static function getUrlData(string $url): string
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        return curl_exec($ch);
    }
    public static function sendSMSTo(string $phoneNumber, string $message, string $auth): bool
    {
        if (substr($phoneNumber, 0, 4) !== "+358" || ($phoneNumber !== $_ENV["ALLOWED_PHONE"] && !in_array($phoneNumber, self::allowedPhones))) {
            return false;
        }
        $sms = array(
            "from" =>  "Summarizer",
            "to" => $phoneNumber,
            "message" => $message,
            'dryrun' => 'yes'
        );

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header'  => 'Authorization: Basic ' .
                    $auth . "\r\n" .
                    "Content-type: application/x-www-form-urlencoded\r\n",
                'content' => http_build_query($sms),
                'timeout' => 10
            )
        ));
        $response = file_get_contents(
            "https://api.46elks.com/a1/sms",
            false,
            $context
        );

        return strstr($http_response_header[0], "200 OK");
    }
    public static function loadEnv($path)
    {
        foreach (explode("\n", file_get_contents($path)) as $envVar) {
            $envVarSplit = explode("=", $envVar);
            $_ENV[$envVarSplit[0]] = $envVarSplit[1];
        }
    }
    public static function generateLLMresult(array $data, float $modifier = 1): string
    {
        $pagesJson = json_encode(["input_data" => $data]);
        $url = $_ENV["LLM_API"];
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($curl, CURLOPT_POSTFIELDS, $pagesJson);
        
        $resp = curl_exec($curl);
        curl_close($curl);

        return $resp;
    }
    public static function generateB64Pdf(string $content): string
    {
        return "";
    }
    public static function generateNewEventId(): string
    {
        return bin2hex(random_bytes(6));
    }
}
