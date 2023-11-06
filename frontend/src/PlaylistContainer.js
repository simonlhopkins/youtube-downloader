import { useEffect, useState } from "react";
import styled from "styled-components";
import PlaylistEntry from "./PlaylistEntry";


const client_id = '1b352e5ba35049b1918e0b310494107e';
const client_secret = 'b79d65aa4cca4e389c38ad01497bb981';



async function getPlaylistData(token, isNewToken) {
    async function getParsedPlaylistData(playlistsData, authToken) {
      return Promise.all(playlistsData.items.map(async (playlist) => {
        //get tracks
        const tracks = await fetch(playlist.tracks.href, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
          return data.items.map(track => track.track);
        })
        const artists = tracks.map((track) => {
          return track.artists.map(artists => {
            return{
              artistName: artists.name,
              artistUrl: artists.external_urls.spotify
            }
          });
        }).flat();
        let artistSet = new Set();
        const filteredArtists = [];
        for(const artist of artists){
          if(!artistSet.has(artist.artistName)){
            artistSet.add(artist.artistName);
            filteredArtists.push(artist);
          }
        }
  
        const playlistImg = playlist.images[0];
        const playlistUrl = playlist.external_urls.spotify;
        return {
          imageUrl: playlistImg.url,
          playlistUrl: playlistUrl,
          artists: filteredArtists
        };
      })).then(data => {
        //song data
        return data;
      });
    } //end get getParsedPlaylistData
    
    const numPlaylists = 3;
    const url = `https://api.spotify.com/v1/users/simonlhopkins/playlists?limit=${numPlaylists}`;
    //get the parsed data
    return fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(async (data) => {
      const parsedData = await getParsedPlaylistData(data, token);
      return parsedData;
    })
    .catch(error => {
        throw(error)
    });
  }

function PlaylistContainer(){
    const [accessToken, setAccessToken] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    async function getAccessToken() {
        const data = new URLSearchParams();
        data.append("grant_type", "client_credentials");
        data.append("client_id", client_id);
        data.append("client_secret", client_secret);
        return fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: data
      
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => data.access_token)
        .catch(error => {
            throw error;
        });
    
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                
                if (localStorage.getItem("cachedPlaylistData")) {
                    const data = JSON.parse(localStorage.getItem("cachedPlaylistData"));
                    setData(data);
                    
                }else{
                    const token = await getAccessToken();
                    setAccessToken(token);
                    const data = await getPlaylistData(token);
                    localStorage.setItem("cachedPlaylistData", JSON.stringify(data));
                    setData(data);
                }
                
            }
            catch(error){
                setError(error);
                return;
            }
            
        }
        fetchData();
    }, [])

    const children = data.map((playlistsData, index)=>{
        return (
            <PlaylistEntry 
                key = {index}
                imageUrl = {playlistsData.imageUrl}
                artists = {playlistsData.artists}
                playlistUrl = {playlistsData.playlistUrl} 
                />
        )
    });

    useEffect(()=>{
        console.log("render, ", data);
    });
    return(
        <>
        <StyledPlaylistContainer>
            {children.length>0 && children}
        </StyledPlaylistContainer>
        {error && <p>Error: {error.toString()}</p>}
        </>
    )
}

const StyledPlaylistContainer = styled.div`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
width: 100%;
`

export default PlaylistContainer;