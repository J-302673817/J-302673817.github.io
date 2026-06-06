<?php
session_start();
require __DIR__ . '/assets/db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    // Redirect to login page if not logged in
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id']; // dit is de id van de ingelogde gebruiker
$message = "";

// map voor uploads
$upload_dir = __DIR__ . '/assets/img/';

// dit doen, omdat je niet een nieuwe gebruiker maakt, maar juist de gegevens van de gebruiker wilt aanvullen
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// If user doesn't exist in database, redirect
if (!$user) {
    session_destroy();
    header("Location: login.php");
    exit();
}

if (isset($_POST['save_profile'])) {

    $headline = $_POST['headline'] ?: null;
    $about = $_POST['about'] ?: null;
    $skills = $_POST['skills'] ?: null;
    $interest = $_POST['interest'] ?: null;

    // check of avatar geupload is
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $_FILES['avatar']['tmp_name'];
        $filename = uniqid() . '_' . basename($_FILES['avatar']['name']);
        $target = $upload_dir . $filename;

        if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

        if (move_uploaded_file($tmp_name, $target)) {
            $avatar_path = 'assets/img/' . $filename; // sla path op in DB
        } else {
            $avatar_path = $user['avatar']; // fallback: oud bestand
        }
    } else {
        $avatar_path = $user['avatar']; // geen nieuwe file, behoud oude
    }

    // update database
    $stmt = $db->prepare("
UPDATE users 
SET avatar = ?, headline = ?, about = ?, skills = ?, interests = ? 
WHERE id = ?
");


    $stmt->execute([$avatar_path, $headline, $about, $skills, $interest, $user_id]);

    $message = "Profiel succesvol bijgewerkt!";
    // refresh data
    $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    header("Location: profiel.php");
    exit();
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>registreren</title>
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
    <!-- AI heeft dit gemaakt, want ik (Iliyana) had geen tijd meer over maar wilde wel nog even testen of het werkt -->
    <div class="container mt-4">
        <h2>Maak je profiel af</h2>

        <?php if ($message): ?>
            <div class="alert alert-success"><?php echo $message; ?></div>
        <?php endif; ?>

        <form method="post" enctype="multipart/form-data">
            <div class="mb-3">
                <label>Avatar</label>
                <?php if ($user['avatar']): ?>
                    <div><img src="<?php echo $user['avatar']; ?>" style="width:100px;height:100px;object-fit:cover;margin-bottom:10px;"></div>
                <?php endif; ?>
                <input type="file" class="form-control" name="avatar" accept="image/*">
            </div>

            <div class="mb-3">
                <label>Headline</label>
                <input type="text" class="form-control" name="headline" value="<?php echo htmlspecialchars($user['headline'] ?? ''); ?>">
            </div>

            <div class="mb-3">
                <label>About</label>
                <textarea class="form-control" name="about"><?php echo htmlspecialchars($user['about'] ?? ''); ?></textarea>
            </div>

            <div class="mb-3">
                <label>Skills</label>
                <input type="text" class="form-control" name="skills" value="<?php echo htmlspecialchars($user['skills'] ?? ''); ?>">
            </div>

            <div class="mb-3">
                <label>Interest</label>
                <input type="text" class="form-control" name="interest" value="<?php echo htmlspecialchars($user['interest'] ?? ''); ?>">
            </div>

            <button type="submit" name="save_profile" class="btn btn-primary">Opslaan</button>
        </form>
    </div>

</body>

</html>