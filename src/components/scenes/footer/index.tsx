import Logo from "@/assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary-100 py-16">
      <div className="justify-content mx-auto w-5/6 gap-16 md:flex">
        <div className="mt-16 basis-1/2 md:mt-0">
          <img alt="logo" src={Logo} />
          <p className="my-5">
            Lorem vitae ut augue auctor faucibus eget eget ut libero. Elementum
            purus et arcu massa dictum condimentum. Augue scelerisque iaculis
            orci ut habitant laoreet. Iaculis tristique.
          </p>
          <p>© lone.wolf.mahmud@gmail.com All Rights Reserved.</p>
        </div>
        <div className="mt-16 basis-1/4 md:mt-0">
          <h4 className="font-bold">Links</h4>
          <p className="my-5 w-full mr-5">
            {/*<!-- Anchor tag linking to my Facebook profile --> */}
            <a href="https://www.facebook.com/cse.mahmud" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block">
                {/* <!-- Image tag to display the Facebook logo --> */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                    alt="Facebook Logo"
                    className="w-12 h-12 float-left mr-5" />
                <span>cse.mahmud</span> 
            </a>
          </p>
          <p className="my-5 w-full mr-5">
            {/*<!-- Anchor tag linking to your LinkedIn profile -->*/}
            <a href="https://www.linkedin.com/in/mahmudulcse/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block">
                {/*<!-- Image tag to display the LinkedIn logo -->*/}
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
                    alt="LinkedIn Logo"
                    className="w-12 h-12 float-left mr-5" />
                <span>in/mahmudulcse/</span>
            </a>
          </p>
          <p className="my-5 w-full mr-5">
            {/*<!-- Anchor tag linking to your GitHub profile -->*/}
            <a href="https://github.com/csemahmud" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block">
                {/*<!-- Image tag to display the GitHub logo -->*/}
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                    alt="GitHub Logo"
                    className="w-12 h-12 float-left mr-5" />
                <span>csemahmud</span>
            </a>
          </p>
        </div>
        <div className="mt-16 basis-1/4 md:mt-0">
          <h4 className="font-bold">Contact Us</h4>
          <p className="my-5">Tempus metus mattis risus volutpat egestas.</p>
          <p>+8170-4381-4193</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
