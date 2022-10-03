import {FormEvent, useState} from "react";
import {useUser} from "../../context/UserContext";
import {Card, CardActions, CardContent, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {getReadableAuthError} from "../../utils/error";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const {register} = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        register(email, password)
            .catch((error:any) => {
                console.error(error);
                setError(getReadableAuthError(error));
            }).finally(() => setLoading(false));
    };

    const isFormValid = !!email && !!password && !!confirmPassword && password === confirmPassword;

    return (
        <form onSubmit={handleRegister} className="m-auto" style={{zIndex: 100}}>
            <Card sx={{ minWidth: 275 }} elevation={10}>
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        className="text-center"
                        color="primary"
                    >
                        Inscription
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
                    <div className="mt-2">
                        <TextField
                            required
                            type="password"
                            label="Confirmez"
                            variant="outlined"
                            className="w-full"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                    </div>
                    {error && <div className="mt-2 error">{error}</div>}
                    <div className="mt-2">
                        Déjà inscrit ? <Link to="/auth/login">Se connecter</Link>
                    </div>
                </CardContent>
                <CardActions className="d-flex justify-center">
                    <LoadingButton
                        disabled={loading || !isFormValid}
                        loading={loading}
                        type="submit"
                        variant="contained"
                    >
                        S'inscrire
                    </LoadingButton>
                </CardActions>
            </Card>
        </form>
    );
}
