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

    public function summarizeUrlsGET($decodedBody)
    {
        $query = $this->db->getDB()
            ->prepare("SELECT * FROM pending_data WHERE id=?");
        $query->execute([$_GET["id"]]);
        $data = $query->fetchAll(PDO::FETCH_ASSOC);
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
            $page = Helper::getUrlData($url);
            // TODO: strip tags from urls 
            $pages[] = $page;
        }


        $pagesJson = json_encode($pages);
        $this->db->getDB()
            ->prepare("INSERT INTO pending_data (status, phone) values (?,?)")
            ->execute(["PENDING", $decodedBody["phone"]]);
        $latestId = $this->db->getDB()->lastInsertId();


        echo json_encode(["id" => $latestId]);
        fastcgi_finish_request();


        // TODO: send data to ai palikka.
        $result = "testi";
        sleep(10);

        $this->db->getDB()
            ->prepare("UPDATE pending_data SET status = ?, response = ? WHERE id = ?")
            ->execute(["DONE", $result, $latestId]);

        // TODO: sms content
        $smsResult = Helper::sendSMSTo($decodedBody["phone"], "Toimiiko sms?", $decodedBody["smsAuth"]);

        if ($smsResult) {
            $this->db->getDB()
                ->prepare("UPDATE pending_data SET status = ? WHERE id = ?")
                ->execute(["SENT", $latestId]);
        }
        die;
    }
}
