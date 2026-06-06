<?php
session_start();
require '../assets/db.php';

$user = null;
$error = "";

if (isset($_POST['login'])) {

    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $db->prepare("SELECT * FROM users WHERE name = :username");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {

        $_SESSION['user_id'] = $user['id'];

        header("Location: ../index.php");
        exit();
    } else {
        $error = "Username of wachtwoord klopt niet!";
    }
}


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
    <link defer rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">


</head>

<body>

    <div class="container-fluid bg-primary text-white py-3">
        <div class="d-flex justify-content-between align-items-center">
            <a href="index.php" class="text-white text-decoration-none">
                <h4 class="mb-0">Mon-in</h4>
            </a>
            <div class="d-flex gap-4">
                <a href="../index.php" class="text-white text-decoration-none">
                    <i class="bi bi-house"></i> Home
                </a>

                <a href="login.php" class="text-white text-decoration-none">
                    <i class="bi bi-box-arrow-in-right"></i> Login
                </a>
                <a href="registreren.php" class="text-white text-decoration-none">
                    <i class="bi bi-person"></i> Registreren
                </a>
            </div>
        </div>
    </div>

    <!-- Bij de links had ik eerst "Login/login.php" maar dat werkte niet. 
     Je moet niet Login/login.php doen want dan denkt de browser (aangezien je al in de map Login zit) dat er een andere map is genaamd Login daarin zit dan deze Login.
     Dat kan die het dus niet vinden. -->

    <div class="container d-flex flex-column align-items-center mt-4">
        <h2>Login</h2>
        <form method="post">
            <label for="username">Username</label><br>
            <input class="form-control" type="text" name="username" required><br>
            <label for="password">Password</label><br>
            <input class="form-control" type="password" name="password" required><br>
            <div class="text-center">
                <p>Not a member? <a href="registreren.php">Register</a></p><br>
                <?php if (!empty($error)): ?>
                    <div class="text-center">
                        <?php echo $error; ?>
                    </div>
                <?php endif; ?>
                <div class="d-grid gap-2 d-md-block">
                    <button class="btn btn-primary" type="submit" name="login">Submit</button>
                </div>

        </form>

    </div>
</body>

</html>