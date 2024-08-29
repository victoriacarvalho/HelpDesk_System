import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className={"container"}>
        <hr />
        <div className="content">
          <div>
            <img src="/logo.png" alt="logo" className="logo-img"/>
          </div>
          <div>
            <h4> Outros Links</h4>
            <ul>
              <Link to={"/"}>Home</Link>
              <Link to={"https://www.linkedin.com/in/victoriacarvalho7"}>Victoria Carvalho</Link>
              <Link to={"http://www.linkedin.com/in/mariacarolina-galarani"}>Maria Carolina</Link>
              <Link to={"https://br.linkedin.com/in/lauracsoares"}>Laura Chaves</Link>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <div>
              <FaPhone />
              <span>999-999-9999</span>
            </div>
            <div>
              <MdEmail />
              <span>ticket+@gmail.com</span>
            </div>
            <div>
              <FaLocationArrow />
              <span>João Monlevade - Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;