import { Link } from 'react-router-dom'


const About = () => {
    return (
        <div className='aboutSection'>
        <span className='pixelFontStyle'>Created by Loveleen Chaudhari</span>
        <Link to="https://github.com/loveleenc" target="_blank"><img src="/assets/mainScreen/github-mark.svg" /></Link>
        </div>
    )
}

export default About