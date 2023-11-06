
import { useEffect } from "react";
import { useRef, useState } from "react";
import styled from "styled-components";

const axios = require('axios');

export const YoutubeDL = () => {

    const [error, setError] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [convertFormat, setConvertFormat] = useState("m4a");
    const [downloadReady, setDownloadReady] = useState(false);
    const [thumbnailURL, setThumbnailURL] = useState(null);
    const textInput = useRef(null);
    
    useEffect(()=>{
        if(thumbnailURL!=null){
            setError(null);
        }
    }, [thumbnailURL])

    function validateYouTubeUrl(url)
    {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        return url.match(regExp);
            
    }

    const onInputChange = (e)=>{
        if(!validateYouTubeUrl(e.target.value)){
            setError("invalid youtube url");
            setThumbnailURL(null);
            return;
        }
        fetch(`http://localhost:3001/thumbnail?url=${e.target.value}`)
        .then(response=>{
            if(response.ok){
                response.json().then(json=>{
                    setThumbnailURL(json.url);
                })
            }else{
                setThumbnailURL(null);
                response.json().then(json=>{
                    setError(json.error);
                });
            }
        }).catch((error)=>{
            console.error(error.toString());
            setThumbnailURL(null);
            setError(error.toString());
        })
    }

    const convertYT = async ()=>{
        const text = textInput.current.value;
        if(!validateYouTubeUrl(text)){
            setError("invalid youtube url");
            setThumbnailURL(null);
            return;
        }
        setIsConverting(true);
        fetch('http://localhost:3001/convertYoutube', 
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },

            mode:'cors',
            body: JSON.stringify({
                url: text,
                format: convertFormat
            })
        })
        .then(response => {
            if(response.ok){
                response.json().then(json=>console.log(json.message));
                setDownloadReady(true);
            }else{
                response.json().then(json=>{
                    setDownloadReady(false);
                    setError(json.error);
                });
            }
        })
        .catch(error=>{
            setDownloadReady(false);
            setError(error.toString());
        }).finally(()=>{
            setIsConverting(false);
        })
        
            
        
        
        
    }

    const formatButtons = ["m4a", "mp4"].map(format=>{
        return <FormatButton 
        onClick = {()=>{setConvertFormat(format)}}
        format = {format}
        key = {format}
        active= {convertFormat == format}
        />
    })
    const downloadVideo = async ()=>{

        fetch('http://localhost:3001/download')
        .then((response) => {
            if (response.ok) {
                // Extract the file name from the response headers
                const contentDisposition = response.headers.get('content-disposition');
                const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
                const suggestedFileName = filenameMatch ? filenameMatch[1] : 'downloaded-file.txt';

                return response.blob().then(blob => ({ blob, suggestedFileName }));
            } else {
                setError("Download request failed");
                throw new Error('Download request failed');
            }
        })
        .then(({ blob, suggestedFileName }) => {
            // Create a blob URL for the downloaded file and trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedFileName; // Set the suggested file name
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => {
            // Handle the error locally without redirecting
            console.error('Download error:', error);
            setError(error.toString());
          });
    }
    return(
        
        <YoutubeDLContainer>
            <h1>youtube dl</h1>
            <input onChange = {onInputChange} ref = {textInput} type="text"/>
            <FormatContainer>
                {formatButtons}
            </FormatContainer>
            <button onClick={convertYT}>convert yt</button>
            <button disabled={isConverting || !downloadReady} onClick={downloadVideo}>{isConverting?"loading...":"DOWNLOAD"}!!</button>

            {thumbnailURL && <StyledThumbnail src = {thumbnailURL}></StyledThumbnail>}
            {error && (<p>{error.toString()}</p>)}
        </YoutubeDLContainer>
        
        
    )
}

function FormatButton({onClick, format, active}){
    return (
        <StyledFormatButton
            $active = {active}
            onClick = {onClick}
        >{format}</StyledFormatButton>
    )
}

const StyledThumbnail = styled.img`
    width: 500px;
    height: auto;
`

const YoutubeDLContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    input {
        min-width: 50%;
    }
    button {
        border-radius: 5px;
        padding: 0.5rem 1rem;
        border: 2px solid red;
    }

    
`
const FormatContainer = styled.div`
    gap: 1rem;
    display: flex;
    justify-content: center;

`

const StyledFormatButton = styled.button`
    background-color: ${props => props.$active?"red":"white"};

`
export default YoutubeDL;