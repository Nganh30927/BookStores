import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { FaCheck, FaAngleDown, FaRegUser, FaRegHeart, FaAlignJustify, FaComputer } from 'react-icons/fa6';
import { IoBagCheckOutline } from 'react-icons/io5';
import { IoCloseSharp } from 'react-icons/io5';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { RiLoginCircleLine, RiLogoutCircleLine, RiShieldUserLine, RiProfileLine } from 'react-icons/ri';
import { useCartStore } from '../../../hooks/useCartStore';
import useAuth from '../../../hooks/useAuth';
import HeaderCategory from '../../Navbar/HeaderCategory';
import MobileMenu from '../../Navbar/MobileMenu';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HomeSearch from '../../Search/HomePageSearch';
import { QueryClient, QueryClientProvider } from 'react-query';
import TabletSearch from '../../Search/TabletSearch';
import MobileSearch from '../../Search/MobileSearch';

const queryClient = new QueryClient();

interface DataType {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  imageURL?: string;
}
const Header = () => {
  const [isDropdownLoginActive, setIsDropdownLoginActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [activeIndexNavigation, setActiveIndexNavigation] = useState(0);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [openMenuTablet, setopenMenuTablet] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main_Menu');

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get('page');

  const int_page = page ? parseInt(page) : 1;

  const cid = params.get('categoryId');
  console.log('cid:', cid);
  const int_cid = cid ? parseInt(cid) : 0;

  const { user, logout, isAuthenticated } = useAuth();
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
                    <span>Contact: fasha.support@gmail.com</span>
                  </li>
                  <li className="px-3">
                    <span>Tel: +8432434234</span>
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
            <QueryClientProvider client={queryClient}>
              <HomeSearch />
            </QueryClientProvider>
            </div>
            <div className={`col-span-3 ${styles.icon}`}>
              <div className="icon_action flex justify-end">
                <div className="site_header_account relative mx-3">
                  <a onClick={handleUserIconClick} href="#">
                    <FaRegUser className="text-xl" />
                  </a>
                  <div className={`${styles.accountDropdown} ${isDropdownLoginActive ? styles.active : ''}`}>
                    <div className="group-hover:block absolute top-full -left-52 px-2 pt-10 mt-4 bg-white border border-gray-100 min-w-max z-50">
                      <div className="px-3 pb-2 border-b border-blueGray-800">
                        {!isAuthenticated && (
                          <>
                            <Link className="group relative flex justify-center p-2 hover:bg-gray-200 transition duration-200" to={'/login'}>
                              <div className="mr-5 text-xl mt-0.5">
                                <RiLoginCircleLine />
                              </div>
                              <div className="mr-24">
                                <span className="block font-bold text-gray-600" data-config-id="auto-txt-5-1">
                                  Đăng nhập
                                </span>
                              </div>
                            </Link>
                            <a className="group relative flex p-2 hover:bg-gray-200 transition duration-200" href="#">
                              <div className="mr-5 text-xl mt-0.5">
                                <RiShieldUserLine />
                              </div>
                              <div className="mr-24">
                                <span className="block font-bold text-gray-600" data-config-id="auto-txt-7-1">
                                  Đăng ký
                                </span>
                              </div>
                            </a>
                          </>
                        )}
                        {isAuthenticated && (
                          <>
                            <span className="group relative flex p-2 hover:bg-gray-200 transition duration-200">
                              <div className="mr-5 text-xl mt-0.5">
                                <RiShieldUserLine />
                              </div>
                              <div className="mr-24">
                                <span className="block font-bold text-red-600" data-config-id="auto-txt-7-1">
                                  {user?.name}
                                </span>
                              </div>
                            </span>
                            <Link className="group relative flex p-2 hover:bg-gray-200 transition duration-200" to={''}>
                              <div className="mr-5 text-xl mt-0.5">
                                <RiProfileLine />
                              </div>
                              <div className="mr-24">
                                <span className="block font-bold text-gray-600" data-config-id="auto-txt-9-1">
                                  Hồ sơ người dùng
                                </span>
                              </div>
                            </Link>
                            <a className="group relative flex p-2 hover:bg-gray-200 transition duration-200 cursor-pointer" onClick={logout}>
                              <div className="mr-5 text-xl mt-0.5">
                                <RiLogoutCircleLine />
                              </div>
                              <div className="mr-24">
                                <span className="block font-bold text-gray-600" data-config-id="auto-txt-9-1">
                                  Đăng xuất
                                </span>
                              </div>
                            </a>
                          </>
                        )}
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
              <HeaderCategory currentCategoryId={int_cid} />
            </div>
            <div className={`col-span-6 flex text-xs xl:text-base mx-auto ${styles.navigation}`}>
              <div className={styles.main_navigation}>
                <ul className="flex">
                  <li className={`px-5 font-bold ${activeIndexNavigation === 0 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(0)}>
                    <Link to="/">Home</Link>
                  </li>
                  <li className={`px-5 font-bold ${activeIndexNavigation === 1 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(1)}>
                    <Link to="/books">Shop</Link>
                  </li>
                  <li className={`px-5 font-bold  ${activeIndexNavigation === 2 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(2)}>
                    <Link to="/Blog">Blog</Link>
                  </li>
                  <li className={`px-5 font-bold  ${activeIndexNavigation === 3 ? styles.active : ''}`} onClick={() => handleItemNavigationClick(3)}>
                    <Link to="/contact">Contact</Link>
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
            <QueryClientProvider client={queryClient}>
              <TabletSearch/>
            </QueryClientProvider>
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
                        <Link to="/contact">Contact</Link>
                      </li>
                      <li>
                        <Link to="/about">About</Link>
                      </li>
                    </ul>
                  </div>
                  <div className={`${activeMenu === 'shop_By_Categories' ? '' : 'hidden'} ${styles.shop_By_Categories}`}>
                    <MobileMenu currentCategoryId={int_cid} />
                  </div>
                </div>
              </Drawer>
            </div>
            <div className="ps-16">
              <div className="logo">{/* <Link to="/"><img src={Logo} alt="" /></Link> */} <h2>LOGO!</h2> </div>
            </div>
            <div className='-mr-28 block lg:hidden md:hidden'>
            <QueryClientProvider client={queryClient}>
              <MobileSearch />
            </QueryClientProvider>
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
                      <span className="ps-3 pe-5 font-extrabold text-xl">SHOPPING CART [{itemCount}]</span>
                      <a onClick={toggleDrawerCart(false)} className={`flex ps-16 pe-5 text-sm font-normal pt-1 ${styles.close}`} href="#">
                        CLOSE <IoCloseSharp className=" font-black text-lg" />
                      </a>
                    </div>
                    <>
                      {itemCount === 0 ? (
                        <div className="text-center  h-96 mt-5">
                          <span>
                            <img src="../../../../public/images/empty-cart.png" alt="" />
                          </span>
                          <span>
                            <h3 className="text-xl text-gray-600 font-bold">Chưa có sản phẩm nào trong giỏ hàng</h3>
                          </span>
                          <Link to={'/products'}>
                            <button className="text-white p-2 rounded-md mt-4 bg-red-600 font-semibold hover:bg-red-400" type="button">
                              VIEW PRODUCTS
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className={styles.product}>
                            <ul>
                              {items.map((item) => {
                                return (
                                  <li>
                                    <div className={` ps-3 ${styles.product_details}`}>
                                      <div className="w-1/5 px-2">
                                        <img
                                          className="block h-20 w-full"
                                          src={`http://localhost:9000` + `${item.imageURL}`}
                                          alt={item.name}
                                          data-config-id="auto-img-1-3"
                                        />
                                      </div>
                                      <div className="w-4/5 px-2">
                                        <div className=" mb-2 items-center justify-between">
                                          <h6
                                            className="font-bold text-sm text-gray-600 overflow-hidden whitespace-nowrap overflow-ellipsis w-64"
                                            data-config-id="auto-txt-2-3"
                                          >
                                            {item.name}
                                          </h6>
                                         <div className='flex gap-3'>
                                         <span className="block text-sm font-bold text-red-600  mt-2" data-config-id="auto-txt-3-3">
                                            {item.price * (1 - (item.discount) / 100)} đ
                                          </span>
                                         <del className="block text-sm font-bold  mt-2" data-config-id="auto-txt-3-3">
                                            {item.price} đ
                                          </del>
                                         </div>
                                        </div>
                                        <div className="flex items-end justify-between">
                                          <div className="inline-flex px-2 font-bold text-gray-400 border border-blueGray-800 bg-slate-700">
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
                                            className="inline-block text-sm font-bold text-gray-500 hover:text-gray-800"
                                            href="#"
                                            data-config-id="auto-txt-4-3"
                                          >
                                            Remove
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className={styles.bottom_cart}>
                            <div className={`flex justify-between px-2 ${styles.subtotal}`}>
                              <strong className="text-lg font-medium">SUBTOTAL:</strong>
                              <span className={styles.total_price}>{total} đ</span>
                            </div>
                            <div className={styles.view_cart}>
                              <Link to={'/cart'}>View cart</Link>
                            </div>
                            <div className={styles.checkout}>
                              <Link to={'/checkout'}>Checkout</Link>
                            </div>
                          </div>
                        </>
                      )}
                    </>
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
