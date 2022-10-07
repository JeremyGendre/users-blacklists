import {Autocomplete, CircularProgress, InputAdornment, TextField} from "@mui/material";
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import React, {FormEvent, useEffect, useState} from "react";
import {useDebounceValue} from "@jeremygendre/react-custom-hooks";
import { query, collection, getDocs, where } from "firebase/firestore";
import {buildCollectionFromSnapshot, db} from "../../config/firebase";
import {BlacklistedUser} from "../../models/BlacklistedUser";
import {useNavigate} from "react-router";

export default function GlobalNicknameSearch(){
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly BlacklistedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounceValue(search);
    const navigate = useNavigate();

    const searchFnc = async () => {
        setLoading(true);
        const q = query(collection(db, "BlacklistedUser"), where("nickname", "==", debouncedValue));
        const querySnapshot = await getDocs(q);
        setOptions(buildCollectionFromSnapshot(querySnapshot));
        setLoading(false);
    };

    useEffect(() => {
        searchFnc();
    },[debouncedValue]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        searchFnc();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/**/}
            <Autocomplete
                id="autocomplete-search"
                sx={{ width: 300 }}
                open={open}
                onOpen={() => {setOpen(true);}}
                onClose={() => {setOpen(false);}}
                getOptionLabel={(option) => option.nickname + ` (${option.sourceUid})`}
                options={options}
                onChange={(event: any, newValue:BlacklistedUser|null) => {
                    if(newValue){
                        navigate(`/list/${newValue.sourceUid}`)
                    }
                }}
                loading={loading}
                size="small"
                renderInput={(params) => (
                    <CssTextField
                        placeholder="Global nickname search..."
                        variant="outlined"
                        required
                        value={search}
                        onChange={e => setSearch(e.target.value)}

                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment sx={{color: 'white'}} position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
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
