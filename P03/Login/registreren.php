<?php
session_start();
require '../assets/db.php';

$message = "";

if (isset($_POST['register'])) {

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $message = "Email bestaat al!";
    } else {

        $stmt = $db->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);


        $user_id = $db->lastInsertId();


        $_SESSION['user_id'] = $user_id;


        header("Location: ../maakprofiel.php");
        exit();
    }
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



    <div class="container d-flex flex-column align-items-center mt-4">
        <h2>Register</h2>


        <form method="post">

            <label>Username</label><br>
            <input class="form-control" type="text" name="username" required><br>

            <label>Email</label><br>
            <input class="form-control" type="email" name="email" required><br>

            <label>Password</label><br>
            <input class="form-control" type="password" name="password" required><br>

            <div class="text-center">
                <p>Already a member? <a href="login.php">Login</a></p>
                <div class="d-grid gap-2 d-md-block">
                    <button class="btn btn-primary" type="submit" name="register">Submit</button>
                </div>

        </form>
    </div>
</body>

</html>