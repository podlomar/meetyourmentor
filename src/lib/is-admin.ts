import { cookies } from "next/headers";

export const isAdmin = () => {
  const adminPwd = cookies().get('adminPwd');
  return adminPwd?.value === process.env.ADMIN_PWD;
};
