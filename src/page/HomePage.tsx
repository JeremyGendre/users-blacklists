import {Button} from "@mui/material";
import {useState} from "react";
import NewSourceFormDialog from "../component/dialogs/NewSourceFormDialog";
import AddIcon from '@mui/icons-material/Add';

export default function HomePage() {
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div className="d-flex h-full">
            <div className="m-auto">
                {/* display the games list here */}
                <Button variant="contained" onClick={() => setOpenDialog(true)} startIcon={<AddIcon />}>
                    New source
                </Button>
                <NewSourceFormDialog open={openDialog} onClose={() => setOpenDialog(false)}/>
            </div>
        </div>
    );
}
