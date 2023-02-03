API ROUTES

BaseUrl = http://10.11.7.11:3001/api

I. AUTHENTICATION

@GET
/auth/login
    - description: redirige l'utilisateur sur l'ecran de connexion de 42api puis redirige vers notre application
    - reponse: pas de reponse mais l'utilisateur est redirige vers l'adresse :
	.http://10.11.7.11:3000/profile/$(user-id) si la double authentification n'est pas activee
	.http://10.11.7.11:3000/login/2fa si la double authentification est activee
    - args : non
    - withCredentials : non
    - utilisation: window.top.location = 'http://10.11.7.11:3001/api/auth/login'

@POST
/auth/2fa/generate
    - description : route pour generer un qr code lorsque l'utilisateur active la double authentification
    - reponse : qr code (binaire)
    - args : non
    - withCredentials : oui
    - utilisation : convertir la reponse de la requete en blob, creer une URL a partir du blob, puis mettre 
    l'URL dans une balise <img src=URL> pour render le qrcode dans la page

    const [qrCode, setQrCode] = useState('');
    const res = await fetch('http://10.11.7.11:3001/api/auth/2fa/generate, {
	method: 'POST', credentials: 'include'
    });
    const blob = await res.blob();
    setQrCode(URL.createObjectURL(blob));
    // pour render le qrcode dans la page 
    <img src={qrCode} />

@POST
/auth/2fa/turn-on
    .description : apres avoir scanne le qr code genere precedemment (via l'appli googleAuthenticator), on active
	la double authentication pour l'utilisateur qui en a fait la demande. Pour cela, on doit envoyer le code 
	a 6 chiffres genere par l'appli a l'api. L'api modifie alors le champ 'isTwoFactorAuthenticationEnabled' 
	du user dans la database a 'true'
    .reponse : rien
    .args : twoFactorAuthenticationCode : string
    .withCredentials : oui
    .utilisation : scanner qrcode via googleAuthenticator, recuperer le code a 6 chiffres via un formulaire,
    puis l'envoyer a l'api via axios

    const [code, setCode];
    axios.post('http://10.11.7.11:3001/api/auth/2fa/turn-on', {
	twoFactorAuthentificationCode: code
    }, {
	withCredentials: true
    });

@POST
/auth/2fa/turn-off
    .description : modifie le champ isTwoFactorEnabled a false
    .reponse : rien
    .args : non
    .withCredentials : oui
    .utilisation : 
    axios.post('http://10.11.7.11:3001/api/auth/2fa/turn-off', {}, { withCredentials: true });

@POST
/auth/2fa/authenticate
    .description : permet a l'utilisateur de s'authentifier via la double auth
    .reponse : l'utilisateur courant (objet User de la database)
    .args: twoFactorAuthenticationCode : string
    .withCredentials : oui
    .utilisation : envoyer le code a 6 chiffres a l'api, recuperer l'id du user via response.data.id, puis
    rediriger l'utilisateur vers la page /profil/id du front via le routeur

    const [id, setId] = useState();
    axios
	.post('http://10.11.7.11:3001/api/auth/2fa/authenticate', {
	   twoFactorAuthenticationCode: code
	}, {
	    withCredentials: true
	})
	.then(response => setId(response.data.id))

    // pour la redirection, si id === true, navigate to page /profil/$id
    {
	id && <Navigate to={`/profil/${id}`} replace={true}`
    }


II. USERS

@GET
/users/:id
    .description : recupere les donnees de l'utilisateur dont l'id est id dans la database (n_win, n_lose, 
    winrate...)
    .reponse : l'utilisateur courant (object User de la database)
    .args: non
    .withCredentials: oui
    .utilisation :
    
    const params = useParams();
    useEffect(() => {
	axios
	    .get(`http://10.11.7.11:3001/api/users/${params.id}`, {
		withCredentials: true
	    })
	    .then(response => setUser(response.data))
    }, [])
