import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function AboutUs(){
    return(
        <div className="about-us" id = "AU">
            <Link to="https://github.com/DanTySmall/Large-Project" className="link-git"><FontAwesomeIcon icon={faInfoCircle} className="about-us-icon" />About Us</Link>
            <p>At Paradise Pours, we aim to provide comprehensive insight into the nutritional content of any alcohol of your choice such as beer, wine, and liquor.
                Understanding these details is crucial for making informed decisions about consumption.
                Whether you're curious about the calorie content, ABV, or other nutritional factors, our goal is to empower you with knowledge that promotes responsible and informed drinking habits.
                Explore our resources to uncover the nutritional facts of your favorite drinks and discover how they fit into your lifestyle.
            </p>
        </div>
    );
}
export default AboutUs;
