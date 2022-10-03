import {FormEvent, useState} from "react";
import {useUser} from "../../context/UserContext";
import {Card, CardActions, CardContent, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {getReadableAuthError} from "../../utils/error";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const {login} = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        login(email, password)
            .catch((error:any) => {
                console.log(error);
                setError(getReadableAuthError(error));
            }).finally(() => setLoading(false));
    };

    const isValidForm = !!email && !!password;

    return (
        <form onSubmit={handleLogin} className="m-auto" style={{zIndex: 100}}>
            <Card sx={{ minWidth: 275, maxWidth: 345 }} elevation={10}>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        className="text-center"
                        color="primary"
                    >
                        Connexion
                    </Typography>
                    <div className="mt-2">
                        <TextField
                            required
                            autoFocus
                            type="email"
                            label="Email"
                            variant="outlined"
                            className="w-full"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mt-2">
                        <TextField
                            required
                            type="password"
                            label="Mot de passe"
                            variant="outlined"
                            className="w-full"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    {error && <div className="mt-2 error">{error}</div>}
                    <div className="mt-2">
                        Nouveau ? <Link to="/auth/register">Inscription</Link>
                    </div>
                </CardContent>
                <CardActions className="d-flex justify-center">
                    <LoadingButton
                        disabled={loading || !isValidForm}
                        loading={loading}
                        type="submit"
                        variant="contained"
                    >
                        Se connecter
                    </LoadingButton>
                </CardActions>
            </Card>
        </form>
    );
}
