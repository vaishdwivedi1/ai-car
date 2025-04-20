const Footer = () => {
  return (
    <footer className="bg-black sticky  w-full">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-between">
        <span className=" me-4 md:me-6 text-white">Vheql</span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-300 sm:mt-0">
          <li>
            <a href="#" className=" me-4 md:me-6 text-white">
              Saved Cars
            </a>
          </li>
          <li>
            <a href="#" className=" me-4 md:me-6 text-white">
              Reservations
            </a>
          </li>
          <li>
            <a href="#" className=" me-4 md:me-6 text-white">
              Cars
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
