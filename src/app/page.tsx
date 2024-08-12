// src/App.tsx

"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "../../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import GooglePicker from "react-google-picker";
import {
    Button,
    Menu,
    MenuItem,
    Typography,
    Box,
    List,
    ListItem,
    LinearProgress,
    TextField,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LinkIcon from "@mui/icons-material/Link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

declare global {
    interface Window {
        google: any;
    }
}

const App: React.FC = () => {
    const [user] = useAuthState(auth);
    const [files, setFiles] = useState<FileList | null>(null);
    const [fileURL, setFileURL] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<
        Record<string, number>
    >({});
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const clientId =
        "427027192929-5uou3ue38lajqm3qmo2d3oouqur8ut31.apps.googleusercontent.com";
    const scope = ["https://www.googleapis.com/auth/drive.file"];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(event.target.files);
            Array.from(event.target.files).forEach((file) =>
                handleUpload(file)
            );
        }
    };

    const handleUpload = (file: File) => {
        setUploading(true);
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]: progress,
                }));
            },
            (error) => console.error("Upload error:", error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    setUploading(false);
                });
            }
        );
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePickerChange = (data: any) => {
        if (
            data[window.google.picker.Response.ACTION] ===
            window.google.picker.Action.PICKED
        ) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            console.log("Document selected is", doc);
            // You can use doc.id or doc.url for further operations
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                maxWidth: 600,
                margin: "auto",
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Upload file
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<UploadFileIcon />}
                onClick={handleMenuClick}
                sx={{ mb: 2 }}
            >
                Select File
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component="label">
                    <UploadFileIcon sx={{ mr: 1 }} /> From my Computer
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                    />
                </MenuItem>
                <MenuItem>
                    <LinkIcon sx={{ mr: 1 }} /> By URL
                    <TextField
                        variant="standard"
                        size="small"
                        fullWidth
                        onChange={(e) => setFileURL(e.target.value)}
                        sx={{ ml: 1 }}
                    />
                    <Button
                        onClick={() =>
                            handleUpload(new File([fileURL], "url-file"))
                        }
                        disabled={uploading}
                    >
                        Upload
                    </Button>
                </MenuItem>
                <MenuItem>
                    <GooglePicker
                        clientId={clientId}
                        developerKey={"AIzaSyBczmq58UjA4i7urh4aVhSBEyq0JZQGpt4"}
                        scope={scope}
                        onChange={handlePickerChange}
                        onAuthFailed={() =>
                            console.error("Google Picker auth failed")
                        }
                        multiselect={true}
                        navHidden={true}
                        authImmediate={false}
                        viewId={"DOCS"}
                    >
                        <CloudUploadIcon sx={{ mr: 1 }} /> From Google Drive
                    </GooglePicker>
                </MenuItem>
            </Menu>

            <List sx={{ mt: 3 }}>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <ListItem key={fileName}>
                        <Typography sx={{ mr: 2 }}>{fileName}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ flexGrow: 1, mr: 1 }}
                        />
                        <Typography>{progress.toFixed(1)}%</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default App;
