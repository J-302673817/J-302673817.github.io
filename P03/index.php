<?php
session_start();
require 'assets/db.php';

$user = null;   // altijd eerst definiëren
$posts = [];    // altijd eerst definiëren



// Check of iemand ingelogd is via session
if (isset($_SESSION['user_id'])) {
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
}

if ($user && isset($_POST['submit'])) {
    $content = trim($_POST['content']);
    if (!empty($content)) {
        $stmt = $db->prepare("INSERT INTO posts (content, created_at, user_id) VALUES (?, NOW(), ?)");
        $stmt->execute([$content, $user['id']]);
        header("Location: index.php"); // refresh
        exit();
    }
}

// Haal posts op
$query = $db->query("
    SELECT posts.*, users.name, users.avatar, users.headline
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY posts.created_at DESC
");
if ($query) {
    $posts = $query->fetchAll(PDO::FETCH_ASSOC);
}

if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $db->prepare("SELECT * FROM users WHERE name = :username");
    $stmt->execute(['username' => $username]);
    $loginUser = $stmt->fetch(PDO::FETCH_ASSOC);



    if ($user && $password == $user['password']) {
        $_SESSION['user_id'] = $user['id']; // user opslaan in session

        header("Location: ../index.php"); // redirect naar home
        exit();
    } else {
        echo "Username of wachtwoord klopt niet!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Home feed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

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
                <a href="#" class="text-white text-decoration-none">
                    <i class="bi bi-house"></i> Home
                </a>

                <?php if ($user): ?>
                    <a href="profiel.php" class="text-white text-decoration-none">
                        <i class="bi bi-person"></i> <?= htmlspecialchars($user['name']) ?>
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

    <div class="container d-flex flex-column align-items-center mt-4">
        <?php if ($user): ?>
            <div class="card p-3 w-100 mb-3">
                <form method="POST">
                    <div class="mb-3">
                        <textarea class="form-control" rows="3" name="content" placeholder="Write your post here"></textarea>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-primary" name="submit">Post</button>
                    </div>
                </form>
            </div>
        <?php else: ?>
            <p class="text-center">Login om een post te maken.</p>
        <?php endif; ?>

<div class="p-3 w-100">
    <h5 class="mb-3">Recent Posts</h5>
    <div class="border-top pt-3">
        <?php foreach ($posts as $post): ?>
            <div class="card mb-3 p-3">
                <div class="d-flex align-items-center mb-2">
                    <a href="user.php?id=<?= $post['user_id'] ?>">
                        <img src="<?= htmlspecialchars($post['avatar']) ?>" width="50" height="50" class="rounded-circle me-2">
                    </a>
                    <div>
                        <a href="user.php?id=<?= $post['user_id'] ?>" class="text-decoration-none text-dark">
                            <strong><?= htmlspecialchars($post['name']) ?></strong>
                        </a><br>
                        <small class="text-muted"><?= htmlspecialchars($post['headline']) ?></small>
                    </div>
                </div>
                <p><?= htmlspecialchars($post['content']) ?></p>
                <small class="text-muted"><?= date('d M Y H:i', strtotime($post['created_at'])) ?></small>
            </div>
        <?php endforeach; ?>
    </div>
</div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.min.js"></script>
</body>

</html>