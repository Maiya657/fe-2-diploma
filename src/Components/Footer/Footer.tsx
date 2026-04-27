import Subscribe from "./Subscribe";

import "./assets/style.css";

import phone from "../../../public/icons/phone.svg";
import mail from "../../../public/icons/mail.svg";
import skype from "../../../public/icons/skype.svg";
import location from "../../../public/icons/location.svg";
import youtube from "../../../public/icons/youtube.svg";
import linkedin from "../../../public/icons/linkedin.svg";
import google from "../../../public/icons/google.svg";
import facebook from "../../../public/icons/facebook.svg";
import twitter from "../../../public/icons/twitter.svg";
import upArrow from "../../../public/icons/upArrow.svg";

function Footer() {
  const moveToTop = () => { window.scrollTo({ top: 0, behavior: "smooth" }) };

  return (
    <footer className="footer">
      <div className="main-content">
        <section className="footer-top">
          <aside className="footer-aside">
            <h3 className="footer-title" id="contacts">Свяжитесь с нами</h3>
            <div className="footer-icon">
              <img src={phone} alt="phone icon" className="footer-icon-img" />
              <a href="tel:+78000000000" className="footer-aside-text">8(800) 000 00 00</a>
            </div>
            <div className="footer-icon">
              <img src={mail} alt="email icon" className="footer-icon-img" />
              <a href="mailto:inbox@mail.ru" className="footer-aside-text">inbox@mail.ru</a>
            </div>
            <div className="footer-icon">
              <img src={skype} alt="skype icon" className="footer-icon-img" />
              <span className="footer-aside-text">tu.train.tickets</span>
            </div>
            <div className="footer-icon">
              <img src={location} alt="location icon" className="footer-icon-img" />
              <span className="footer-aside-text">г. Москва<br />ул. Московская 27-35<br />555 555</span>
            </div>
          </aside>
          <article className="footer-subscribe-wrapper">
            <h3 className="footer-subscribe-title">Подписка</h3>
            <Subscribe />
            <div className="footer-subscribe-socials">
              <h3 className="footer-title">Подписывайтесь на нас</h3>
              <div className="subscribe-socials-media">
                <a href="foo" className="footer-subscribe-icon">
                  <img src={youtube} alt="youtube-icon" />
                </a>
                <a href="foo" className="footer-subscribe-icon">
                  <img src={linkedin} alt="linkedin-icon" />
                </a>
                <a href="foo" className="footer-subscribe-icon">
                  <img src={google} alt="google-icon" />
                </a>
                <a href="foo" className="footer-subscribe-icon">
                  <img src={facebook} alt="facebook-icon" />
                </a>
                <a href="foo" className="footer-subscribe-icon">
                  <img src={twitter} alt="twitter-icon" />
                </a>
              </div>
            </div>
          </article>
        </section>
      </div>
      <div className="footer-bottom-line">
        <div className="main-content">
          <section className="footer-bottom">
            <h1 className="footer-logo">Лого</h1>
            <button onClick={moveToTop} className="footer-btn-circle">
              <img src={upArrow} alt="to-top-button" className="footer-btn-circle" />
            </button>
            <span className="footer-text">2025 WEB</span>
          </section>
        </div>
      </div>
    </footer>
  )
}

export default Footer
