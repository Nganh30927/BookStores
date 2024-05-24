import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { FaCheck, FaAngleDown, FaRegUser, FaRegHeart, FaAlignJustify, FaComputer } from 'react-icons/fa6';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoCloseSharp } from 'react-icons/io5';
import { CiMobile1, CiDesktopMouse1, CiSearch } from 'react-icons/ci';
import { PiTelevision } from 'react-icons/pi';
import { FaFireAlt } from 'react-icons/fa';
import { useCartStore } from '../../../hooks/useCartStore';
import useAuth from '../../../hooks/useAuth';
import { IoIosTabletPortrait, IoMdLaptop } from 'react-icons/io';

const Header = () => {
  const [isDropdownLoginActive, setIsDropdownLoginActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [activeIndexNavigation, setActiveIndexNavigation] = useState(0);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [openMenuTablet, setopenMenuTablet] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main_Menu');

  const { user, logout } = useAuth();
  const { items, total, itemCount, removeItem, decreaseQuantity, increaseQuantity } = useCartStore();

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleItemNavigationClick = (index: React.SetStateAction<number>) => {
    setActiveIndexNavigation(index);
  };

  const toggleDrawerCart = (isOpenCart: boolean) => () => {
    setOpenCart(isOpenCart);
  };

  const toggleDrawerMenuTablet = (isOpenMenuTablet: boolean) => () => {
    setopenMenuTablet(isOpenMenuTablet);
  };

  const handleUserIconClick = () => {
    setIsDropdownLoginActive(!isDropdownLoginActive);
    console.log('isDropdownLoginActive');
  };

  const handleSearchButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowSearchResult(!showSearchResult);
  };

  return (
    <header>
      <div className={styles.header}>
        <div className={` py-2 hidden md:block ${styles.top_header}`}>
          <div className="container mx-auto 2xl:px-28 lg:px-5 md:px-3 text-center main_top_header grid grid-cols-12 justify-center items-center">
            <div className="left_top_header col-span-6">
              <div>
                <ul className="flex text-base">
                  <li className="px-3 md:contents">
                    <Link to="">Contact: fasha.support@gmail.com</Link>
                  </li>
                  <li className="px-3">
                    <Link to="">Tel: +8432434234</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className={`col-span-6 ${styles.right_top_header}`}>
              <div className="flex justify-end">
                <div className={`pe-7 ${styles.return}`}>
                  <ul className="flex text-base">
                    <li className="pe-1 pt-1">
                      <FaCheck />
                    </li>
                    <li>Free 30 day money back guarantee</li>
                  </ul>
                </div>
               
              </div>
            </div> */}
          </div>
        </div>
        <div className={` hidden lg:block  ${styles.middler_header}`}>
          <div className="main_bottom_header grid grid-cols-12 container mx-auto 2xl:px-28 lg:px-5 text-center py-5 justify-center items-center">
            <div className="logo col-span-3">
              {/* <Link to="/"><img src={Logo} alt="" /></Link> */}
              <h1>FASHA.COM</h1>
            </div>
            <div className={`col-span-6 relative ms-20 2xl:ms-10 lg:ms-10 ${styles.search}`}>
              <form onClick={handleSearchButtonClick} className="form" action="" method="get">
                <input type="search" placeholder="Search products..." />
                <button type="submit">
                  <CiSearch />
                </button>
              </form>
              {/* {showSearchResult && (
                <div className={`absolute ${styles.search_result}`}>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong>$123.123</strong>
                      </div>
                    </div>
                  </a>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong>$123.123</strong>
                      </div>
                    </div>
                  </a>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong className="text-sm font-bold">$123.123</strong>
                      </div>
                    </div>
                  </a>
                </div>
              )} */}
            </div>
            <div className={`col-span-3 ${styles.icon}`}>
              <div className="icon_action flex justify-end">
                <div className="site_header_account relative mx-3">
                  <a onClick={handleUserIconClick} href="#">
                    <FaRegUser className="text-xl" />
                  </a>
                  <div className={`${styles.accountDropdown} ${isDropdownLoginActive ? styles.active : ''}`}>
                    <div className={styles.account_wrap}>
                      <div className={styles.account_inner}>
                        <div className={`flex justify-between mb-4 ${styles.account_login_header}`}>
                          <span className="text-lg">Sign in</span>
                          <span>
                            <a href="#">Create an Account</a>
                          </span>
                        </div>
                        <form className={`mb-2 ${styles.accont_form_login}`}>
                          <p className="mb-5">
                            <label className="flex text-base">
                              Email
                              <span className="px-1">*</span>
                            </label>
                            <input name="Email" type="text" required placeholder="Email" />
                          </p>
                          <p className="mb-5">
                            <label className="flex text-base">
                              Password
                              <span className="px-1">*</span>
                            </label>
                            <input name="Password" type="text" required placeholder="Password" />
                          </p>
                          <button type="submit">Login</button>
                        </form>
                        <div className={styles.forget_password_account}>
                          <a href="">Forget your password?</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="site_header_wishlist mx-3">
                  <a className="flex" href="">
                    <FaRegHeart className="text-xl" />
                    <span className="ms-1 -mt-2">0</span>
                  </a>
                </div>
                <div className="site_header_cart relative mx-3">
                  <a onClick={toggleDrawerCart(true)} className="flex" href="#">
                    <IoBagCheckOutline className="text-xl" />
                    <span className="ms-1 -mt-2">{itemCount}</span>
                  </a>
                  {/* <Drawer anchor="right" open={openCart} onClose={toggleDrawerCart(false)} className={styles.cart}>
                    <div className={styles.shopping_cart}>
                      <div className={`py-5 flex justify-between ${styles.title}`}>
                        <span className="ps-3 pe-5 font-extrabold text-xl">SHOPPING CART</span>
                        <a onClick={toggleDrawerCart(false)} className={`flex ps-16 pe-5 text-sm font-normal pt-1 ${styles.close}`} href="#">
                          CLOSE <IoCloseSharp className=" font-black text-lg" />
                        </a>
                      </div>

                      <div className={styles.bottom_cart}>
                        <div className={`flex justify-between px-2 ${styles.subtotal}`}>
                          <strong className="text-lg font-medium">SUBTOTAL:</strong>
                          <span className={styles.total_price}>$13212.54</span>
                        </div>
                        <div className={styles.view_cart}>
                          <a href="#">View cart</a>
                        </div>
                        <div className={styles.checkout}>
                          <a href="#">Checkout</a>
                        </div>
                      </div>
                    </div>
                  </Drawer> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={` hidden lg:block  ${styles.bottom_header}`}>
          <div className="main_bottom_header grid grid-cols-12 container mx-auto 2xl:px-28 lg:px-5 text-center justify-center items-center py-2">
            <div className={`col-span-3 relative ${styles.category}`}>
              <div className={` flex justify-between text-center ${styles.shopby_category}`}>
                <span className="text-sm">Shop by categories</span>
                <p className="text-base">
                  <FaAlignJustify />
                </p>
              </div>
              <div className={` hidden absolute ${styles.menu_category}`}>
                <ul>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <CiMobile1 className="text-lg me-4" />
                      <span className="text-sm">Mobiles</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <IoIosTabletPortrait className="text-lg me-4" />
                      <span className="text-sm">Tablets</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <IoMdLaptop className="text-lg me-4" />
                      <span className="text-sm">Laptops</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <PiTelevision className="text-lg me-4" />
                      <span className="text-sm">Televisions</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <FaComputer className="text-lg me-4" />
                      <span className="text-sm">Computer & Gamming</span>
                    </a>
                  </li>
                  <li>
                    <a className="flex font-medium text-center px-3 py-3" href="#">
                      <CiDesktopMouse1 className="text-lg me-4" />
                      <span className="text-sm">Accessories</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`col-span-6 flex text-xs xl:text-base mx-auto ${styles.navigation}`}>
              <div className={styles.main_navigation}>
                <ul className="flex">
                  <li className={`px-5 font-bold ${activeIndexNavigation === 0 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(0)}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={`px-5 font-bold ${activeIndexNavigation === 1 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(1)}>
                    <Link to="/Shop">Shop</Link>
                  </li>
                  <li className={`px-5 font-bold  ${activeIndexNavigation === 2 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(2)}>
                    <Link to="/Blog">Blog</Link>
                  </li>
                  <li className={`px-5 font-bold  ${activeIndexNavigation === 3 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(3)}>
                    <Link to="/Contact">Contact</Link>
                  </li>
                  <li className={`px-5 font-bold  ${activeIndexNavigation === 4 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(4)}>
                    <Link to="/About">About</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={` hidden sm:hidden md:block lg:hidden xl:hidden ${styles.middler_header_tablet}`}>
          <div className="main_middler_header_tablet grid grid-cols-12 px-5 justify-center items-center py-4">
            <div className="logo col-span-4 pt-2">
              {/* <Link to="/"><img src={Logo} alt="" /></Link> */}
              <h2>FASHA.COM</h2>
            </div>
            <div className={`title col-span-8  ${styles.search}`}>
              <form onClick={handleSearchButtonClick} className="form" action="" method="get">
                <input type="search" placeholder="Search products..." />
                <button type="submit">
                  <CiSearch />
                </button>
              </form>
              {/* {showSearchResult && (
                <div className={`absolute ${styles.search_result}`}>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong>$123.123</strong>
                      </div>
                    </div>
                  </a>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong>$123.123</strong>
                      </div>
                    </div>
                  </a>
                  <a href="#">
                    <div className={`flex ${styles.product_item}`}>
                      <img
                        style={{ width: "60px", height: "60px" }}
                        src={VieNamFlag}
                        alt=""
                      />
                      <div className={styles.product_content}>
                        <h3 className="text-sm font-normal">
                          Titlezxccccccccccccccccccccccccccc
                        </h3>
                        <strong className="text-sm font-bold">$123.123</strong>
                      </div>
                    </div>
                  </a>
                </div>
              )} */}
            </div>
          </div>
        </div>
        {/* mobile toggle */}
        <div className={` block lg:hidden md:block sm:block ${styles.bottom_header_tablet}`}>
          <div className="main_bottom_header_tablet flex justify-between px-5  items-center py-4 border-b border-gray-100">
            <div>
              <a onClick={toggleDrawerMenuTablet(true)} className="flex" href="#">
                <FaAlignJustify className="text-xl" />
              </a>
              <Drawer anchor="left" open={openMenuTablet} onClose={toggleDrawerMenuTablet(false)} className={styles.MenuTablet}>
                <div className={styles.main_nav}>
                  <div className={` py-5 flex justify-between ${styles.title}`}>
                    <ul className="flex px-3">
                      <li>
                        <span className={`${activeMenu === 'main_Menu' ? styles.active : ''}`} onClick={() => handleMenuClick('main_Menu')}>
                          Main Menu
                        </span>
                      </li>
                      <li>
                        <span className={`${activeMenu === 'shop_By_Categories' ? styles.active : ''}`} onClick={() => handleMenuClick('shop_By_Categories')}>
                          Shop By Categories
                        </span>
                      </li>
                    </ul>
                    <a onClick={toggleDrawerMenuTablet(false)} className={` pe-5 text-sm font-normal pt-1 ${styles.close}`} href="#">
                      <IoCloseSharp className=" font-black text-lg" />
                    </a>
                  </div>
                  <div className={`${activeMenu === 'main_Menu' ? '' : 'hidden'} ${styles.main_Menu}`}>
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/Shop">Shop</Link>
                      </li>
                      <li>
                        <Link to="/Blog">Blog</Link>
                      </li>
                      <li>
                        <Link to="/Contact">Contact</Link>
                      </li>
                      <li>
                        <Link to="/About">About</Link>
                      </li>
                    </ul>
                  </div>
                  <div className={`${activeMenu === 'shop_By_Categories' ? '' : 'hidden'} ${styles.shop_By_Categories}`}>
                    <ul>
                      <li>
                        <a href="#">Mobiles</a>
                      </li>
                      <li>
                        <a href="#">Tablets</a>
                      </li>
                      <li>
                        <a href="#">Laptops</a>
                      </li>
                      <li>
                        <a href="#">Televisions</a>
                      </li>
                      <li>
                        <a href="#">Computer & Gamming</a>
                      </li>
                      <li>
                        <a href="#">Accessories</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Drawer>
            </div>
            <div className="ps-16">
              <div className="logo">{/* <Link to="/"><img src={Logo} alt="" /></Link> */}</div>
            </div>
            <div>
              <div className={` relative ${styles.site_header_cart_tablet}`}>
                <a onClick={toggleDrawerCart(true)} className="flex" href="#">
                  <IoBagCheckOutline className="text-xl" />
                  <span className="ms-1 -mt-2">{itemCount}</span>
                </a>
                <Drawer anchor="right" open={openCart} onClose={toggleDrawerCart(false)} className={styles.cart}>
                  <div className={styles.shopping_cart}>
                    <div className={`py-5 flex justify-between ${styles.title}`}>
                      <span className="ps-3 pe-5 font-extrabold text-xl">SHOPPING CART</span>
                      <a onClick={toggleDrawerCart(false)} className={`flex ps-16 pe-5 text-sm font-normal pt-1 ${styles.close}`} href="#">
                        CLOSE <IoCloseSharp className=" font-black text-lg" />
                      </a>
                    </div>
                    {itemCount === 0 ? (
                      <h2>null</h2>
                    ) : (
                      <>
                        {items.map((item) => {
                          return (
                            <>
                              <div className={styles.product}>
                                <div className="mb-auto pb-10">
                                  <div className="flex pt-4 pb-5 border-t border-gray-800 bg-orange-50">
                                    <div className="w-1/5 px-2">
                                      <img
                                        className="block w-full"
                                        src={`http://localhost:9000` + `${item.imageURL}`}
                                        alt=""
                                        data-config-id="auto-img-1-3"
                                      />
                                    </div>
                                    <div className="w-4/5 px-2">
                                      <div className=" mb-2 justify-between">
                                        <h6
                                          className=" font-bold text-sm text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis w-64"
                                          data-config-id="auto-txt-2-3"
                                        >
                                          {item.name}
                                        
                                        </h6>
                                        <span className=" text-sm font-bold text-gray-500" data-config-id="auto-txt-3-3">
                                          {item.price} đ
                                        </span>
                                      </div>
                                      <div className="flex items-end justify-between">
                                        <div className="inline-flex px-2 font-bold text-white border border-blueGray-800 bg-slate-600">
                                          <button
                                            onClick={() => {
                                              decreaseQuantity(item.id);
                                            }}
                                            className="inline-block p-1"
                                          >
                                            <svg
                                              width={8}
                                              height={2}
                                              viewBox="0 0 8 2"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                              data-config-id="auto-svg-2-3"
                                            >
                                              <path d="M7 1H1" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                          </button>
                                          <input
                                            className="w-12 text-sm font-bold text-center bg-transparent outline-none"
                                            value={item.quantity}
                                            data-config-id="auto-input-5-3"
                                          />
                                          <button
                                            onClick={() => {
                                              increaseQuantity(item.id);
                                            }}
                                            className="inline-block p-1"
                                          >
                                            <svg
                                              width={8}
                                              height={8}
                                              viewBox="0 0 8 8"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                              data-config-id="auto-svg-3-3"
                                            >
                                              <path
                                                d="M4 1V4M4 4V7M4 4H7M4 4L1 4"
                                                stroke="white"
                                                strokeWidth="0.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                        <a
                                          onClick={() => {
                                            removeItem(item.id);
                                          }}
                                          className="inline-block mr-3 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-500 hover:text-black"
                                          href="#"
                                          data-config-id="auto-txt-4-3"
                                        >
                                          Remove
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.bottom_cart}>
                                <div className={`flex justify-between px-2 ${styles.subtotal}`}>
                                  <strong className="text-lg font-medium">SUBTOTAL:</strong>
                                  <span className={styles.total_price}>{total}</span>
                                </div>
                                <div className={styles.view_cart}>
                                  <a href="#">View cart</a>
                                </div>
                                <div className={styles.checkout}>
                                  <a href="#">Checkout</a>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )}
                  </div>
                </Drawer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
