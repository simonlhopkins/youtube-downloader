import { BarChart, Battery } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

function GetFormattedTime() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
function StatusBar() {
    const [time, setTime] = useState(GetFormattedTime());

    useEffect(() => {
        // Set up an interval to update the time every second
        const intervalID = setInterval(() => {
            setTime(GetFormattedTime());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalID);
    }, []);
    return (
        <StatusBarContainer>
            <p>{time}</p>
            <RightSideContainer>
                <BarChart />
                <p>LTE</p>
                <Battery />
            </RightSideContainer>
        </StatusBarContainer>
    )
}


const StatusBarContainer = styled.div`
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    gap: 0.42rem;
    opacity: 1;
    z-index: 100;
    color: black;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    margin-left: 3.9rem;
    margin-right: 2.64rem;
    box-sizing: padding-box;
    
`

const RightSideContainer = styled.div`
    display: flex;
    align-items: center;
    gap: inherit;
`

export default StatusBar;