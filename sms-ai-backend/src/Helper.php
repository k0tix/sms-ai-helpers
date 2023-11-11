<?php

declare(strict_types=1);

class Helper
{
    private const allowedPhones = [
        // TODO: add numbers that can be sent to
    ];
    public static function getUrlData(string $url): string
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        return curl_exec($ch);
    }
    public static function sendSMSTo(string $phoneNumber, string $message, string $auth): bool {
        if(substr($phoneNumber,0,4) !== "+358" || !in_array($phoneNumber, self::allowedPhones)) {
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
            'header'  => 'Authorization: Basic '.
                        $auth . "\r\n".
                        "Content-type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($sms),
            'timeout' => 10
        )));
        $response = file_get_contents("https://api.46elks.com/a1/sms",
            false, $context);
        
        return strstr($http_response_header[0],"200 OK");
          
    }
}
