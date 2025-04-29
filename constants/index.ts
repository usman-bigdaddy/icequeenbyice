import {
  BsPeople,
  BsArrowLeftShort,
  BsSearch,
  BsChevronDown,
  BsFillImageFill,
  BsReverseLayoutTextSidebarReverse,
  BsPerson,
} from "react-icons/bs";
import {
  AiFillEnvironment,
  AiOutlineBarChart,
  AiOutlineFileText,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineProduct,
} from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";
import { IconType } from "react-icons";

type MenuItem = {
  icon?: IconType;
  route?: string;
  text: string;
  spacing?: boolean;
  logout?: boolean;
};

export const adminSideBarLinks: MenuItem[] = [
  {
    route: "/admin/dashboard",
    text: "Dashboard",
  },
  {
    icon: AiOutlineProduct,
    route: "/admin/products",
    text: "Products",
  },

  {
    icon: AiOutlineBarChart,
    route: "/admin/orders",
    text: "Orders",
  },

  {
    icon: BsPeople,
    route: "/admin/users",
    text: "Users",
    spacing: true,
  },

  // {
  //   icon: BsPerson,
  //   route: "/admin/profile",
  //   text: "Profile",
  // },

  // {
  //   icon: AiOutlineSetting,
  //   route: "/setting",
  //   text: "Setting",
  // },
  {
    icon: AiOutlineLogout,
    text: "Logout",
    // spacing: true,
    logout: true,
  },
];

export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
};
