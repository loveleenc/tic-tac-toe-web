import { Link } from 'react-router-dom'


const title = "View this project on github"

const About = () => {
    return (
        <>
        <i>Created by Loveleen Chaudhari (me!)</i>
        <Link to="https://github.com/loveleenc" target="_blank"><img src="/assets/mainScreen/github-mark.svg" /></Link>
        </>
    )
}

export default About