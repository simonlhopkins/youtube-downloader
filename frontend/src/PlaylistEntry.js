import styled from "styled-components";


function PlaylistEntry(props){


    const artistLabels = props.artists.map((artist, i)=>{
        return <ArtistLabel key = {i} href = {artist.artistUrl} target = "_blank" >{artist.artistName}</ArtistLabel>
    });

    return (
        <Parent>
            <ArtistLablesParent>
                {artistLabels}
            </ArtistLablesParent>
            <PlaylistImg src = {props.imageUrl}/>
        </Parent>
        
    )
}

const Parent = styled.div`
position: relative;
margin: 1rem;
`

const ArtistLablesParent = styled.div`
position: absolute;
max-width: 100%;
display: flex;
left: 0;
top: 0;
flex-wrap: wrap;
opacity: 1;
transition: 0.3s;
`

const PlaylistImg = styled.img`
max-width: 100%;
align-self: center;
`

const websiteMainColor = "blue"
const websiteSecondaryColor = "white"
const ArtistLabel = styled.a`
white-space: nowrap;
border: 1px solid ${websiteMainColor};
background-color: ${websiteSecondaryColor};
color: ${websiteMainColor};
border-radius: 9999px;
overflow: hidden;
max-width: 100%;
box-sizing: border-box;
display: block;
text-decoration: none;
text-align: center;
margin: 0.1rem;
padding: 0.4rem;
align-self: start;
flex: 1;
flex-basis:auto;
`

const Li = styled.li`
    color: blue;
    background: ${props=>props.color || "red"};
`

export default PlaylistEntry;