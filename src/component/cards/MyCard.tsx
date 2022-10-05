import {Card, CardProps} from "@mui/material";
import {PropsWithChildren, useState} from "react";

export default function MyCard({children, ...other}: PropsWithChildren<CardProps>){
    const [shadow, setShadow] = useState(1);

    const onMouseOver = () => setShadow(3);

    const onMouseOut = () => setShadow(1);

    return (
        <Card sx={{ maxWidth: 345 }} elevation={shadow} onMouseOver={onMouseOver} onMouseOut={onMouseOut} {...other}>
            {children}
        </Card>
    );
}
