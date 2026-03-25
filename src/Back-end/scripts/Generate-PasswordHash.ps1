param(
    [Parameter(Mandatory = $true)]
    [string]$Password
)

$saltLength = 16
$keyLength = 32
$iterations = 100000

$salt = New-Object byte[] $saltLength
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($salt)

$derive = New-Object System.Security.Cryptography.Rfc2898DeriveBytes(
    $Password,
    $salt,
    $iterations,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256)

$hash = $derive.GetBytes($keyLength)

Write-Output ($iterations.ToString() + "." + [Convert]::ToBase64String($salt) + "." + [Convert]::ToBase64String($hash))
