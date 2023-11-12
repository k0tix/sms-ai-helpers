<?php

declare(strict_types=1);

include_once "Helper.php";

class Routes
{
    private $db;
    const routeOverrides = [];
    public function __construct(DB $db)
    {
        $this->db = $db;
    }

    public function resolve($routeRaw)
    {
        $result = [400, "Bad Request"];
        $route = preg_replace("/[^A-Za-z0-9 ]/", '', $routeRaw);
        $jsonBody = json_decode(file_get_contents('php://input'), true);
        if (isset(self::routeOverrides[$route])) {
            $function = self::routeOverrides[$route];
            $result = $this->$function($jsonBody);
        } else {
            if (method_exists($this, $route)) {
                $result = $this->$route($jsonBody);
            }
        }
        http_response_code(isset($result[0]) ? $result[0] : 200);
        die(isset($result[1]) ? $result[1] : "");
    }

    public function heartbeatGET()
    {
        return [200, "'yes'"];
    }

    public function randomfactGET()
    {
        $url = "https://en.wikipedia.org/wiki/Special:Random";
        $page = Helper::cleanupUrlData(Helper::getUrlData($url));
        $result = Helper::generateLLMresult([$page], 2.1);
        return [200, $result];
    }

    public function summarizeUrlsGET($decodedBody)
    {
        $query = $this->db->getDB()
            ->prepare("SELECT * FROM pending_data WHERE eventid=?");
        $query->execute([$_GET["id"]]);
        $data = $query->fetch(PDO::FETCH_ASSOC);
        $retData = ["id" => $data["eventid"], "status" => $data["status"]];
        return [200, json_encode($retData)];
    }

    public function dlPdfGET($decodedBody)
    {
        // TODO: finish this
        $query = $this->db->getDB()
            ->prepare("SELECT response FROM pending_data WHERE eventid=?");
        $query->execute([$_GET["id"]]);
        $data = $query->fetch(PDO::FETCH_ASSOC);
        return [200, json_encode($data)];
    }

    public function summarizeUrlsPOST($decodedBody)
    {
        if (
            !is_array($decodedBody)
            || !isset($decodedBody["urls"]) || !is_array($decodedBody["urls"])
            || !isset($decodedBody["phone"]) || !is_string($decodedBody["phone"])
            || !isset($decodedBody["smsAuth"]) || !is_string($decodedBody["smsAuth"])
        ) {
            return [400, "Bad Request"];
        }
        $pages = [];
        foreach ($decodedBody["urls"] as $url) {
            $page = Helper::cleanupUrlData(Helper::getUrlData($url));
            $pages[] = $page;
        }

        $eventId = Helper::generateNewEventId();
        $this->db->getDB()
            ->prepare("INSERT INTO pending_data (status, phone, eventid) values (?,?,?)")
            ->execute(["PENDING", $decodedBody["phone"], $eventId]);
        $latestId = $this->db->getDB()->lastInsertId();


        echo json_encode(["id" => $eventId]);
        fastcgi_finish_request();


        $result = Helper::generateLLMresult($pages, 1.01);

        $this->db->getDB()
            ->prepare("UPDATE pending_data SET status = ?, response = ? WHERE id = ?")
            ->execute(["DONE", $result, $latestId]);

        // TODO: sms content
        $dlUrl = "<url>". "/dlPdf?id=" . $eventId;
        $smsResult = Helper::sendSMSTo($decodedBody["phone"], "SMSummarizer result is ready, dl at: $dlUrl", $decodedBody["smsAuth"]);

        if ($smsResult) {
            $this->db->getDB()
                ->prepare("UPDATE pending_data SET status = ? WHERE id = ?")
                ->execute(["SENT", $latestId]);
        }
        die;
    }
}
