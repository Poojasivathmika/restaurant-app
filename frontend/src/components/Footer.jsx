const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Restaurant App. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-400">Made with ♥ for foodies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
