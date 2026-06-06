<?php

session_start();
require __DIR__ . '/assets/db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}


$user_id = $_SESSION['user_id'];

$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// DELETE post
if (isset($_POST['delete'])) {
    $post_id = $_POST['post_id'];
    $stmt = $db->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$post_id, $user['id']]);
    header("Location: profiel.php");
    exit();
}

// haal alle posts van deze user
$stmt = $db->prepare("
    SELECT * FROM posts
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$user['id']]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profiel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
</head>
<body>

    <!-- Navbar -->
    <div class="container-fluid bg-primary text-white py-3">
        <div class="d-flex justify-content-between align-items-center">
            <a href="index.php" class="text-white text-decoration-none">
                <h4 class="mb-0">Mon-in</h4>
            </a>
            <div class="d-flex gap-4">
                <a href="index.php" class="text-white text-decoration-none">
                    <i class="bi bi-house"></i> Home
                </a>

                <?php if ($user): ?>
                    <a href="#" class="text-white text-decoration-none">
                        <i class="bi bi-person"></i> <?= htmlspecialchars($user['name']) ?>
                    </a>
                    <a href="logout.php" class="text-white text-decoration-none">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </a>
                <?php else: ?>
                    <a href="login/login.php" class="text-white text-decoration-none"> <i class="bi bi-box-arrow-in-right"></i>
                        Login
                    </a>
                    <a href="login/registreren.php" class="text-white text-decoration-none"><i class="bi bi-person"></i>

                        Registreren
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

   <div class="container mt-5">

    <div class="card shadow-lg border-0 p-4 text-center">

        <!-- Avatar -->
        <?php if ($user['avatar']): ?>
            <img src="<?php echo $user['avatar']; ?>" 
                 class="rounded-circle mx-auto mb-3"
                 style="width:120px;height:120px;object-fit:cover;">
        <?php else: ?>
            <div class="bg-secondary rounded-circle mx-auto mb-3"
                 style="width:120px;height:120px;"></div>
        <?php endif; ?>

        <!-- Naam -->
        <h2 class="fw-bold mb-1"><?php echo htmlspecialchars($user['name']); ?></h2>

        <!-- Headline -->
        <p class="text-muted mb-3">
            <?php echo htmlspecialchars($user['headline'] ?: 'Geen headline toegevoegd'); ?>
        </p>

        <!-- Edit knop -->
        <a href="maakprofiel.php" class="btn btn-outline-primary btn-sm mb-4">
            Profiel bewerken
        </a>

        <hr>

        <!-- About -->
        <div class="text-start mb-4">
            <h5><i class="bi bi-person-lines-fill"></i> About</h5>
            <p class="text-muted">
                <?php echo $user['about'] ? nl2br(htmlspecialchars($user['about'])) : 'Nog niets toegevoegd...'; ?>
            </p>
        </div>

        <!-- Skills -->
        <div class="text-start mb-4">
            <h5><i class="bi bi-lightning-fill"></i> Skills</h5>
            <p class="text-muted">
                <?php echo htmlspecialchars($user['skills'] ?: 'Geen skills toegevoegd'); ?>
            </p>
        </div>

        <!-- Interests -->
        <div class="text-start">
            <h5><i class="bi bi-heart-fill"></i> Interests</h5>
            <p class="text-muted">
                <?php echo htmlspecialchars($user['interests'] ?: 'Geen interesses toegevoegd'); ?>
            </p>
        </div>

    </div>
    <div class="container mt-4">
    <h4>my Posts</h4>
    <?php if ($posts): ?>
        <?php foreach ($posts as $post): ?>
            <div class="card mb-3 p-3 shadow-sm">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <p><?= htmlspecialchars($post['content']) ?></p>
                        <small class="text-muted"><?= date('d M Y H:i', strtotime($post['created_at'])) ?></small>
                    </div>
                    <form method="POST" class="ms-3">
                        <input type="hidden" name="post_id" value="<?= $post['id'] ?>">
                        <button type="submit" name="delete" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p class="text-muted">You have not made any posts..</p>
    <?php endif; ?>
</div>

</div>
</body>
</html>