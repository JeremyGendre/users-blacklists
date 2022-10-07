import {InputAdornment, TextField} from "@mui/material";
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import React, {FormEvent, useState} from "react";

export default function GlobalNicknameSearch(){
    const [search, setSearch] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(search);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CssTextField
                id="global-search"
                placeholder="Global nickname search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment sx={{color: 'white'}} position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="outlined"
                size="small"
                required
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </form>
    );
}

const CssTextField = styled(TextField)({
    '& .MuiInputBase-root':{
        color:'white',
    },
    '& label.Mui-focused': {
        color: 'green',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
            color: 'white'
        },
        '&:hover fieldset': {
            borderColor: 'lightgray',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'lightgray',
        },
    },
});
