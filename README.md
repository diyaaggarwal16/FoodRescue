# FoodRescue
A platform to reduce food waste by connecting surplus food with people who need it.

## Backend configuration

Set the database credentials and a private JWT signing secret in the environment before starting the backend. `JWT_SECRET` must contain at least 32 characters. The values below are PowerShell examples; replace the placeholders with your own local credentials and a randomly generated secret.

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/foodrescue_db'
$env:DB_USERNAME = 'your_mysql_user'
$env:DB_PASSWORD = 'your_mysql_password'
$env:JWT_SECRET = 'replace_with_a_random_secret_of_at_least_32_characters'
```

Do not commit these values. If a credential or signing secret was previously shared or committed, rotate it. Rotating `JWT_SECRET` invalidates tokens signed with the old secret, so users will need to sign in again.
