import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from 'react-router-dom';


const buttonData = [
    {
        url: "/youtube-dl",
        label: "youtube download"
    },
    {
        url: "/playlist",
        label: "playlists"
    },
    {
        url: "/djaskdjlask",
        label: "not found url"
    }
];
function NavBar (){

    const location = useLocation();
    const currentURL = location.pathname;

    const buttons = buttonData.map((button, i) =>{
        return (
            <NavEntry
                key = {i}
                $active = {button.url == currentURL}
                to = {button.url}
            >
                {button.label}
            </NavEntry>
        )
    });

    
    return(
        <Wrapper>
            {buttons}
        </Wrapper>
    )
}


const Wrapper = styled.div`
    display: inline-flex;
`
const NavEntry = styled(Link)`
    display: flex;
    background: ${props => props.$active?"red":"white"};
    border: 2px solid black;
    padding: 5px 30px;
    &:hover {
        background: rgba(255,0,0, 0.5);;
    }
`
export default NavBar;