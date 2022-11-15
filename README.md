API ROUTES

BaseUrl = http://localhost:3001/api

/auth/login
    .description: redirige l'utilisateur sur l'ecran de connexion de 42api puis redirige vers notre application
    .reponse: pas de reponse mais l'utilisateur est redirige vers l'adresse :
	- http://localhost:3000/profile/$(user-id) si la double authentification n'est pas activee
	- http://localhost:3000/login/2fa si la double authentification est activee

/auth/2fa
- /generate
    .description : route pour generer un qr code lorsque l'utilisateur active la double authentification
    .reponse : qr code
    .type : binaire

- /turn-on
    .description : apres avoir scanne le qr code genere precedemment (via l'appli googleAuthenticator), on active
    la double authentication pour l'utilisateur qui en a fait la demande. Pour cela, l'api modifie dans la table 
    du user dans la DB, le champ 'isTwoFactorAuthenticationEnabled' a 'true'
    .reponse : rien

- /turn-off
    .description : modifie le champ isTwoFactorEnabled a false
    .reponse : rien

- /authenticate
    .description : permet a l'utilisateur de s'authentifier via la double auth
    .reponse : l'utilisateur courant
    .type : objet User (objet User de la database, donc avec les champs id, username, email, n_win,
    winrate...)

/profile
- /$user-id
    .description : recupere les donnees de l'utilisateur dont l'id est $user-id dans la database (n_win, n_lose, 
    winrate...)
    .reponse : l'utilisateur courant
    .type : objet User
