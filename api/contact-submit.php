<?php
// Proxy Web3Forms submission so the access key is never exposed to the browser.
//
// Hostinger: place this file under your public site root at /api/contact-submit.php
// Set your Web3Forms access key in ONE of these ways:
// 1) Prefer: environment variable WEB3FORMS_ACCESS_KEY (if your hosting supports it)
// 2) Fallback: edit the $ACCESS_KEY constant below (least preferred)

header('Cache-Control: no-store');

function json_response($code, $data) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_response(405, ['success' => false, 'message' => 'Method not allowed.']);
}

// Honeypot: Web3Forms expects botcheck to be present and EMPTY.
if (isset($_POST['botcheck']) && $_POST['botcheck'] !== '') {
  json_response(400, ['success' => false, 'message' => 'Botcheck failed.']);
}

$ACCESS_KEY = getenv('WEB3FORMS_ACCESS_KEY');
if (!$ACCESS_KEY) {
  // Fallback (edit if you can't set env vars). Keep secret on server.
  $ACCESS_KEY = '8ec7a28a-1979-4c39-8791-18fbf60bba44';
}
if (!$ACCESS_KEY) {
  json_response(500, ['success' => false, 'message' => 'Server missing WEB3FORMS_ACCESS_KEY.']);
}

// Build payload (forward all fields except access_key from client).
$payload = $_POST;
unset($payload['access_key']);
$payload['access_key'] = $ACCESS_KEY;
if (!isset($payload['botcheck'])) $payload['botcheck'] = '';

// Ensure name/subject exist (mirrors your front-end behavior).
$first = isset($payload['firstName']) ? trim((string)$payload['firstName']) : '';
$last  = isset($payload['lastName']) ? trim((string)$payload['lastName']) : '';
if (!isset($payload['name']) || trim((string)$payload['name']) === '') {
  $full = trim($first . ' ' . $last);
  if ($full !== '') $payload['name'] = $full;
}
if (!isset($payload['subject']) || trim((string)$payload['subject']) === '') {
  $payload['subject'] = 'New contact request — Specialized Medical';
}

$ch = curl_init('https://api.web3forms.com/submit');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Accept: application/json',
  'Content-Type: application/x-www-form-urlencoded',
]);

$body = curl_exec($ch);
$curlErr = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($body === false) {
  json_response(500, ['success' => false, 'message' => 'Proxy request failed.', 'error' => $curlErr]);
}

$data = json_decode($body, true);
if (!is_array($data)) {
  json_response(502, ['success' => false, 'message' => 'Invalid response from Web3Forms.']);
}

json_response(($status >= 200 && $status < 600) ? $status : 200, $data);

