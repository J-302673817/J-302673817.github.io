<?php
session_start();
require __DIR__ . '/assets/db.php';

// Ingelogde gebruiker
$loggedInUser = null;
if (isset($_SESSION['user_id'])) {
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $loggedInUser = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Geopende profiel pagina
if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit();
}
$user_id = $_GET['id'];
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    echo "Gebruiker niet gevonden.";
    exit();
}

// Haal posts van deze gebruiker
$stmt = $db->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($user['name']) ?> | Profiel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
</head>
<body>

<div class="container-fluid bg-primary text-white py-3">
    <div class="d-flex justify-content-between align-items-center">
        <a href="index.php" class="text-white text-decoration-none">
            <h4 class="mb-0">Mon-in</h4>
        </a>
        <div class="d-flex gap-4">
            <a href="index.php" class="text-white text-decoration-none">
                <i class="bi bi-house"></i> Home
            </a>

            <?php if ($loggedInUser): ?>
                <a href="profiel.php" class="text-white text-decoration-none">
                    <i class="bi bi-person"></i> <?= htmlspecialchars($loggedInUser['name']) ?>
                </a>

                <a href="logout.php" class="text-white text-decoration-none">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </a>
            <?php else: ?>
                <a href="login/login.php" class="text-white text-decoration-none">
                    <i class="bi bi-box-arrow-in-right"></i> Login
                </a>

                <a href="login/registreren.php" class="text-white text-decoration-none">
                    <i class="bi bi-person"></i> Registreren
                </a>
            <?php endif; ?>

        </div>
    </div>
</div>


<div class="container mt-5">
    <div class="card shadow-lg border-0 p-4 text-center">
        <?php if ($user['avatar']): ?>
            <img src="<?= htmlspecialchars($user['avatar']) ?>" class="rounded-circle mx-auto mb-3" style="width:120px;height:120px;object-fit:cover;">
        <?php else: ?>
            <div class="bg-secondary rounded-circle mx-auto mb-3" style="width:120px;height:120px;"></div>
        <?php endif; ?>

        <h2 class="fw-bold mb-1"><?= htmlspecialchars($user['name']) ?></h2>
        <p class="text-muted mb-3"><?= htmlspecialchars($user['headline'] ?: 'Geen headline toegevoegd') ?></p>

        <hr>

        <div class="text-start mb-4">
            <h5><i class="bi bi-person-lines-fill"></i> About</h5>
            <p class="text-muted"><?= $user['about'] ? nl2br(htmlspecialchars($user['about'])) : 'Nog niets toegevoegd...' ?></p>
        </div>

        <div class="text-start mb-4">
            <h5><i class="bi bi-lightning-fill"></i> Skills</h5>
            <p class="text-muted"><?= htmlspecialchars($user['skills'] ?: 'Geen skills toegevoegd') ?></p>
        </div>

        <div class="text-start mb-4">
            <h5><i class="bi bi-heart-fill"></i> Interests</h5>
            <p class="text-muted"><?= htmlspecialchars($user['interests'] ?: 'Geen interesses toegevoegd') ?></p>
        </div>
    </div>

    <div class="mt-4">
        <h4>Posts van <?= htmlspecialchars($user['name']) ?></h4>
        <?php if ($posts): ?>
            <?php foreach ($posts as $post): ?>
                <div class="card mb-3 p-3 shadow-sm">
                    <p><?= htmlspecialchars($post['content']) ?></p>
                    <small class="text-muted"><?= date('d M Y H:i', strtotime($post['created_at'])) ?></small>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p class="text-muted">Deze gebruiker heeft nog geen posts geplaatst.</p>
        <?php endif; ?>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.min.js"></script>
</body>
</html>