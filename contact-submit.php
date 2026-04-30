<?php
// Root-level fallback for hosts where /api/* paths 404.
// This file simply includes the real handler.
require __DIR__ . '/api/contact-submit.php';

